import { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./Portfolio.css";

export default function Portfolio() {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date("2019-01-01")
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    new Date("2024-04-24")
  );

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        const response = await fetch("/portfolio.xlsx"); // must be inside public/
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Parse starting from row 6 (header row)
        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, {
          range: 5,
          defval: "",
        });

        const formatted = jsonData
          .filter((row: any) => row["NAV Date"] && row["NAV (Rs)"])
          .map((row: any) => {
            let dateStr = String(row["NAV Date"]).trim();
            dateStr = dateStr.replace(/\//g, "-"); // normalize separators
            const [day, month, year] = dateStr.split("-");
            const isoDate = `${year}-${month}-${day}`;

            // Clean NAV numbers (remove commas)
            const nav = parseFloat(String(row["NAV (Rs)"]).replace(/,/g, ""));

            return {
              date: isoDate,
              focused: nav,
              nifty50: nav * 0.8 + 50, // dummy comparison series
            };
          })
          .reverse();

        setExcelData(formatted);
      } catch (err) {
        console.error("Excel load failed:", err);
      }
    };

    fetchExcel();
  }, []);

  // Filtered data based on fromDate & toDate
  const filteredData = useMemo(() => {
    if (!fromDate || !toDate) return excelData;
    return excelData.filter((row) => {
      const d = new Date(row.date);
      return d >= fromDate && d <= toDate;
    });
  }, [excelData, fromDate, toDate]);

  // Compute drawdowns (Focused vs its running max)
  const dataWithDrawdown = useMemo(() => {
    let maxSoFar = -Infinity;
    return filteredData.map((row) => {
      if (row.focused > maxSoFar) maxSoFar = row.focused;
      const drawdown = ((row.focused - maxSoFar) / maxSoFar) * 100;
      return { ...row, drawdown };
    });
  }, [filteredData]);

  // Compute dynamic trailing returns
  const trailingReturns = useMemo(() => {
    if (!dataWithDrawdown.length) return null;

    const latest = dataWithDrawdown[dataWithDrawdown.length - 1].focused;
    const niftyLatest = dataWithDrawdown[dataWithDrawdown.length - 1].nifty50;

    const findReturn = (days: number, key: "focused" | "nifty50") => {
      const index = Math.max(dataWithDrawdown.length - 1 - days, 0);
      const past = dataWithDrawdown[index][key];
      return ((dataWithDrawdown[dataWithDrawdown.length - 1][key] - past) / past) * 100;
    };

    const currentYear = new Date().getFullYear();
    const ytdIndex = dataWithDrawdown.findIndex(
      (row) => new Date(row.date).getFullYear() === currentYear
    );

    const ytdFocused = ((latest - (dataWithDrawdown[ytdIndex]?.focused || latest)) / (dataWithDrawdown[ytdIndex]?.focused || latest)) * 100;
    const ytdNifty = ((niftyLatest - (dataWithDrawdown[ytdIndex]?.nifty50 || niftyLatest)) / (dataWithDrawdown[ytdIndex]?.nifty50 || niftyLatest)) * 100;

    const focusedDD = Math.min(...dataWithDrawdown.map((row) => row.drawdown));
    const niftyDD = Math.min(...dataWithDrawdown.map((row) => row.drawdown));

    return {
      focused: {
        "YTD": ytdFocused,
        "1D": findReturn(1, "focused"),
        "1W": findReturn(5, "focused"),
        "1M": findReturn(22, "focused"),
        "1Y": findReturn(252, "focused"),
        "DD": focusedDD,
      },
      nifty50: {
        "YTD": ytdNifty,
        "1D": findReturn(1, "nifty50"),
        "1W": findReturn(5, "nifty50"),
        "1M": findReturn(22, "nifty50"),
        "1Y": findReturn(252, "nifty50"),
        "DD": niftyDD,
      },
    };
  }, [dataWithDrawdown]);

  return (
    <div className="home-container">
      <h2 className="home-title">Portfolios</h2>

      {/* Trailing Returns Table */}
      <div className="table-wrapper">
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>YTD</th>
              <th>1D</th>
              <th>1W</th>
              <th>1M</th>
              <th>1Y</th>
              <th>DD</th>
            </tr>
          </thead>
          <tbody>
            {trailingReturns && (
              <>
                <tr>
                  <td>Focused</td>
                  {Object.values(trailingReturns.focused).map((val, idx) => (
                    <td key={idx}>{val.toFixed(1)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>NIFTY50</td>
                  {Object.values(trailingReturns.nifty50).map((val, idx) => (
                    <td key={idx}>{val.toFixed(1)}%</td>
                  ))}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Equity Curve Header */}
      <div className="chart-header">
        <div className="chart-left">
          <h3 className="latest-posts-title">Equity Curve</h3>
          <span className="live-since-text">
            Live since {fromDate?.toISOString().split("T")[0]}
          </span>
        </div>
        <div className="chart-right">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="date-filters-inline">
              <DatePicker
                label="From"
                value={fromDate}
                onChange={(newValue: Date | null) =>
                  setFromDate(newValue ?? undefined)
                }
                slotProps={{ textField: { size: "small" } }}
              />
              <DatePicker
                label="To"
                value={toDate}
                onChange={(newValue: Date | null) =>
                  setToDate(newValue ?? undefined)
                }
                slotProps={{ textField: { size: "small" } }}
              />
            </div>
          </LocalizationProvider>
        </div>
      </div>

      {/* Main Equity Curve */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataWithDrawdown}>
            <CartesianGrid strokeDasharray="3 3" />
            {/* XAxis hidden */}
            {/* <XAxis 
              dataKey="date" 
              tickFormatter={(date) => date.slice(5)} 
              interval="preserveStartEnd" 
              angle={-45} 
              textAnchor="end"
            /> */}
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="focused" stroke="green" dot={false} />
            <Line type="monotone" dataKey="nifty50" stroke="blue" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Drawdown Chart */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dataWithDrawdown}>
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="red"
              fill="pink"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
