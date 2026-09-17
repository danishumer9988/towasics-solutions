import React from 'react'
import Slider from 'react-slick'

const testimonials = [
  { name: "Luigi", date: "Italy", review: "This is the third time working with Aans. He is cooperative, professional, and highly knowledgeable. Communication is smooth and formal.The client values independence, respectful communication, and exceeding expectations. They plan to continue future projects with him. A+ Service!", rating: 5 },
  { name: "Naseem", date: "Saudi Arabia", review: "“The work is fantastically done. He's fast, diligent, and delivers ahead of time. He knows what to do 👍🏼. I give it 10/10 🥳. Thank you so much!”", rating: 5 },
  { name: "Salama", date: "United Arab Emirates", review: "“Very good work as always, highly recommended. Love it when a plan works. I love it when you can rely on someone to do their job on time and exactly as described. Especially at this price, it's impressive. Absolutely recommended!!! See you on the next job!”", rating: 5 },
  { name: "Bagau", date: "France", review: "Working with Towasic Solutions is my pleasure. They did my work beyond my expectations. Outstanding work, excellent communication, and very knowledgeable. Highly recommended by me for all your web scraping, automation, and lead generation projects. See you soon in new projects. Thanks", rating: 5 },
  { name: "Crlslouis", date: "United States", review: "“Great! Did a great job communicating.”", rating: 5 },
  { name: "Lawrence", date: "United States", review: "“He understood the task very well and was extremely responsive.”", rating: 5 },
  { name: "Alyazia", date: "United Arab Emirates", review: "I'm the luckiest buyer here because I got the chance to hire you and get work from you. During the development process, you were very communicative, respectable, and your requirements gathering process was very clear to me. It was my 3rd project with you and I look forward to working with you in the long run.", rating: 5 },
  { name: "James", date: "India", review: "Good communication and highly skilled”", rating: 5 },
  { name: "Shantnu", date: "Nepal", review: "“He's very cooperative. Delivered on time. I tested the application, found minor issues, and he fixed them quickly with no flaws. Very responsive and professional seller. I recommend him.”", rating: 5 }
];

export default function TestimonialSlider() {
  const settings = {
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <section className="py-16 bg-[#EEFAFD] w-full overflow-hidden">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-[38px] lg:text-[42px] font-bold text-[#086B87] font-inter tracking-tight leading-snug">
            200+ Excellent Reviews – Here’s a Glimpse
          </h2>
          
          <div className="text-left sm:text-right shrink-0">
            <p className="text-base sm:text-lg font-medium text-[#086B87] mb-1">
              Trusted by Clients Worldwide
            </p>
            <div className="flex sm:justify-end gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <svg key={n} className="w-5 h-5 text-[#ffc107] fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <Slider {...settings} className="testimonial-slider -mx-3">
          {testimonials.map((item, idx) => (
            <div key={idx} className="px-3 pb-4">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/90 h-[265px] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#1aa4ac] text-white flex items-center justify-center font-bold text-lg shrink-0">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#086B87] text-base leading-tight">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {[...Array(item.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-[#ffc107] fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-6">
                    {item.review}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

