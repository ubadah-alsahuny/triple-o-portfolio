# 🖼 Triple O: Portfolio.
A multi-page complex website made for my university's fourth year project, to create canvases that displays your profession acting as a portfolio and a showcase for your work, using **React** as the <ins>Frontend</ins>, and **Laravel** as the <ins>Backend</ins>.  
This project was a built by a group of 4 students including me; in where the concepts of React were still fresh in my head; as this was one of the first projects that helped me start applying my knowledge in a practical way.  

## 📦 Technologies
> React  
> JavaScript  
> Laravel  
> crop-image Library  
> canvas Library  

## ✨ Features
Here is what Triple O: Portfolio has to offer for the user:
- Simple Weather Condition Information: The user can easily view the entire week's (day and night) weather conditions displayed in simple terms and visuals.  
* Detailed Weather Condition Information: Another option is the ability to view a more detailed forecast of a certain day of the week only by hovering over its weather card, which will display a Square of Information containing them.  
+ User Comfort with Measurments Units: As fetched from the API, the weather temperature is arriving in Fahrenheit. However, not all users may be comfortable or common with this measurment unit; that's why the addition of a button that transforms the temperature value from Fahrenheit to Celsius got added.
- Responsive Design: The website works on any reolution of any device with no downgrades in functionality or smoothness.  

## 👨🏽‍🍳 The Process
I took a deep dive into some of the projects that can be done by a front end React developer which showcase their abilities and improve them; as I was running out of ideas, and every other idea was a replica of the previous, and so I found this small project to work on!  
While I was reading the description of the project and the should's and should'nt's, I started building the vision and the final experince in my head.  
I went up to Google and searched for modern weather dashboard designs, since I was looking for the short route to immediately start programming, just as I came across an advanced weather dashboard Figma design, which has the same exact pallete and style I had envisioned for the website.  
Afterwards, I got into the design and started extracting the values of the (weather cards, texts, and colors' HEXs) and transfered them directly into my IDE, where I will be applying them to my components and code.  
The design wasn't hard to implement; but some overflow and responsiveness issues appeared nonetheless. Such as (The issue of the Square of Information overflowing out of the screen if the weather card's number is the first or last). That's when I enabled my searching and prompting senses and read a lot of StackOverflow users similar issues, which helped a lot in understanding these ambigious concepts.  
In the process of making the page responsive, I realized that the different resolutions and types of screens (The Square of Information issue mentioned above) requires different display settings for this design I was making, which sparked "This is not very practical and scalable" idea in my head; as I was writing a lot of conditional media queries that won't work on the long run if the website ever decides to change the size of the weather cards; the thing that led me to know that there is an invention that helps with an issue like this called FloatingUI. However, I didn't use, since it's a small project.  

## 📚 What I Learned
During the development of the website, I went through a lot of hardships in API fetching. Although it's not my first time using the UseEffect or fetching from an API, but the concept is still a bit hard for me to implement without rewatching certain videos that can remind on the chain of thoughts I should have, or some crucial syntax conditions.  
### 📌 Data Fetching from a Remote Public API:  
It sounds easy, and is easy! I just haven't put my hands on this concept enough, which always gets me to forget how it all works out. But, I am now more familiar with UseEffect in React, and can confidently say that it is above 50% covered in my brain.  

### 🖌 Responsive Design Core Principles:  
I have done multiple reponsive pages throughout my programming journy, but this time was different as I used Pseudo Elements in CSS (after, and before), which added a lot of life and modernity to the final product. Plus, it tought how to make these elements reponsive in different environments. 

### 🧼 Data Filtering:  
The API that I was using didn't have a direct field indicating the weather is short words, such as (Sunny, Cloudy, Rainy, etc...), but had a fields called shortForecast, that had keywords on how the weather will be throughout the day. I took these keywords and put them inside a function of testing the whole sentence to detect them using the ```.includes``` function, and returned the keyword as a response from the function to display the right icon.

## 🏗 How Can It Be Improved?  
- Adding a Light Theme, or a theme change when switching between daytime and nighttime forecasts.  
* More detailed information about the weather, such as (Wind, Propability of rain, etc...).
+ A menu of fields to change the area or place that its weather needs to be fetched.  

## 🖼 Images of Website:  
<img width="1366" height="768" alt="Landing" src="https://github.com/user-attachments/assets/aad66222-08b5-4a28-95e4-7c3bd9202b68" />
<img width="1366" height="768" alt="Canvas Example" src="https://github.com/user-attachments/assets/fa8a8b2b-635e-44b8-bad4-fdbf62527b47" />
<img width="1366" height="768" alt="Profile" src="https://github.com/user-attachments/assets/49c22ac5-16e7-4b64-a51b-acae817fc8d2" />

