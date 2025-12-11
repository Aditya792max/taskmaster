import React from "react";
import "../Styles/Home.css"; // import CSS

export default function Home() {
     return (
          <div className="home-container">

               {/* Background Video */}
               <video className="background-video" autoPlay muted loop playsInline>
                    <source src="/video.mp4" type="video/mp4" />
                    Your browser does not support HTML5 video.
               </video>

               {/* Text Overlay */}
               <div className="overlay-content">
                    <h1>The Task Master!</h1>
                    <p>
                         <br />
                         created by
                         <br />
                         <strong>Aditya Vikram Kirtania</strong>.

                    </p>
               </div>

          </div>
     );
}