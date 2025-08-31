import Card from "../component/Card";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <h2 className="home-title">Home</h2>

      {/* Top cards */}
      <div className="cards-container">
        <Card title="Get started" text="Read our getting started guide to get the most out of your subscription." />
        <Card title="Community" text="Join the conversation on Slack for Premium subscribers." />
        <Card title="Visit website" text="Keep up with our latest content on our website." />
      </div>

      {/* Latest Posts */}
      <h3 className="latest-posts-title">Latest Posts</h3>
      <div className="latest-posts">
        <div className="post">
          <p className="post-date">Apr 18, 2024</p>
          <h4 className="post-title">CM Fixed Income: Exiting Banking & PSU to Add a New Gilt Fund</h4>
          <p className="post-text">We are increasing the duration of our Fixed Income portfolio...</p>
          <a href="#" className="post-link">Read full post</a>
        </div>
        <div className="post">
          <p className="post-date">Apr 18, 2024</p>
          <h4 className="post-title">CM Fixed Income: Exiting Banking & PSU to Add a New Gilt Fund</h4>
          <p className="post-text">We are increasing the duration of our Fixed Income portfolio...</p>
          <a href="#" className="post-link">Read full post</a>
        </div>
        <div className="post">
          <p className="post-date">Apr 18, 2024</p>
          <h4 className="post-title">CM Fixed Income: Exiting Banking & PSU to Add a New Gilt Fund</h4>
          <p className="post-text">We are increasing the duration of our Fixed Income portfolio...</p>
          <a href="#" className="post-link">Read full post</a>
        </div>
        <div className="post">
          <p className="post-date">Apr 18, 2024</p>
          <h4 className="post-title">CM Fixed Income: Exiting Banking & PSU to Add a New Gilt Fund</h4>
          <p className="post-text">We are increasing the duration of our Fixed Income portfolio...</p>
          <a href="#" className="post-link">Read full post</a>
        </div>
      </div>
    </div>
  );
}
