import { useState } from "react";
import "./Feedback.css";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ rating, comment })
    });

    if (res.ok) {
      setMessage("Thank you for your feedback!");
      setComment("");
      setRating(0);
    } else {
      setMessage("Error submitting feedback.");
    }
  };

  return (
    <div className="feedback-page">
      <h2>We value your feedback</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Star rating */}
        <div className="star-rating">
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1;
            return (
              <span
                key={index}
                className={ratingValue <= (hover || rating) ? "star filled" : "star"}
                onClick={() => setRating(ratingValue)}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(rating)}
              >
                ★
              </span>
            );
          })}
        </div>

        {/* Comment box */}
        <textarea
          placeholder="Write your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        {/* Submit button */}
        <button type="submit">Submit</button>
      </form>

      {message && <p className="feedback-message">{message}</p>}
    </div>
  );
}
