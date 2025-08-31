import "./Card.css";

interface CardProps {
  title: string;
  text: string;
}

export default function Card({ title, text }: CardProps) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  );
}
