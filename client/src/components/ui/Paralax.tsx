"use client";
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { useMediaQuery } from 'react-responsive';




export const products = [
  {
    title: "",
    link: "https://userogue.com",
    thumbnail: "https://evmwheels.com/front-theme/images/Group%20316.png",
  },

  {
    title: "",
    link: "https://userogue.com",
    thumbnail: "https://img.freepik.com/premium-photo/luxury-car-rental-car-sale-social-media-instagram-post-template-design_1126722-2530.jpg",
  },
  {
    title: "",
    link: "https://userogue.com",
    thumbnail: "https://evmwheels.com/front-theme/images/Group%20316.png",
  },
  {
    title: "",
    link: "https://userogue.com",
    thumbnail: "https://evmwheels.com/front-theme/images/Group%20316.png",
  },

  
];

export const HeroParallax = () => {
  const firstRow = products.slice(0, 1);
  const secondRow = products.slice(1, 2);

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const isMobile = useMediaQuery({ maxWidth: 500 });
  const isTablet = useMediaQuery({ minWidth: 510, maxWidth: 900 });
  const isDesktop = useMediaQuery({ minWidth: 901, maxWidth:1400 });

  const translateXReverseMobile = useTransform(scrollYProgress, [0, .3], [1000, 70]);
  const translateXTablet = useTransform(scrollYProgress, [0, .4], [1000, 300]);
  const translateXReverseDesktop = useTransform(scrollYProgress, [0, .4], [1000,90])

  const translateX = useSpring(
    isMobile
    ? translateXReverseMobile
    : isTablet
    ? translateXTablet
    : translateXReverseDesktop,
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0.7, 1], [250, -1000]),
    springConfig
  );
 
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.150], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.350], [20, 0]),
    springConfig
  );
  const rotateZM = useSpring(
    useTransform(scrollYProgress, [0.7, 1], [0, -20]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-800, 600]),
    springConfig
  );

  return (
    <>
      <div
        ref={ref}
        className="h-full py-40 overflow-hidden mb-[200px]  antialiased relative flex flex-col self-auto [perspective:1000px]  [transform-style:preserve-3d] "
      >
        <Header />
        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            opacity,
            scrollBehavior:'smooth',
            transition:'ease-in-out'
          }}
          className=""
        >
          <motion.div className="flex flex-row-reverse   mb-[200px] ">
            {firstRow.map((product,index) => (
              <div key={index} className="flex flex-col items-center lg:flex-row bg-gradient-to-br from-slate-900 to-green-500 max-w-full md:max-w-[800px] lg:max-w-[1300px] md:min-h-800px lg:min-h-[800px] gap-5 rounded-lg py-[50px] px-[50px] md:py-[100px] md:px-[100px] mx-auto  ">
                <div>
                  <h1 className="max-w-[250px] md:max-w-[600px] lg:max-w-[700px] lg:min-w-[500px] text-lg md:text-[24px]   p-1 md:p-4 text-justify lg:text-left  from-black  via-gray-700 to-white  bg-gradient-to-t bg-clip-text text-transparent  capitalize font-bold parallax1H1 my-[40px] leading-[2rem] md:leading-[3rem] ">
                  Find the perfect ride at unbeatable prices. Whether it's a weekend getaway or a long-term rental, we’ve got you covered with flexible plans and zero hidden fees. Book now and hit the road in style!
                  </h1>
                </div>

                <div className="mt-10 lg:mt-[-10px] ">
                  <ProductCard
                    product={product}
                    translate={translateX}
                  />
                </div>
              </div>
            ))}
          </motion.div>
          {/* <motion.div className="flex flex-row-reverse  mb-[200px]  "  style={{ rotateZ: rotateZM  }}>
            {secondRow.map((product,index) => (
                
              <div key={index}  className="flex flex-row justify-center items-center p-[100px] bg-gradient-to-br from-green-400 to-slate-900 max-w-[1300px] rounded-lg py-[100px] px-[100px] mx-auto ">
                <div>
                  <ProductCard
                    product={product}
                    translate={translateXReverse}
                    
                  />
                </div>
                <div className="pr-10">
                  <h1 className="w-[400px] text-4xl    p-4 mr-[200px] text-start  from-white via-gray-50 to-black-700 bg-gradient-to-bl bg-clip-text text-transparent font-bold capitalize  ">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Adipisci odit accusantium saepe iure eligendi, nihil
                    perferendis reprehenderit dolore distinctio quaerat
                  </h1>
                </div>
              </div>
       
            ))}
          </motion.div> */}
          <motion.div className="flex h-[600px] flex-row-reverse space-x-reverse space-x-20">
           
          </motion.div>
        </motion.div>
      </div>
     
    </>
  );
};

export const Header = () => {
  return (
    <div className="flex justify-between items-center max-w-7xl relative mx-auto py-20 z-20 md:py-40 px-4 w-full bg-transparent  left-0 top-0">
        <div>
      <h1 className="text-2xl md:text-7xl font-bold dark:text-black bg-transparent">
        The Ultimate <br /> Car rental For You
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-slate-800">
        We provide beautiful products with clean and trust We are a team of
        skilled and experienced professionals who are passionate about our work.
      </p>
      </div>
     
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-48 w-[50vh] md:h-96 md:w-[100vh] relative flex-shrink-0"
    >
      
        <div className="md:m-10">
          <img
            src={product.thumbnail}
           
            className="object-contain object-left-top absolute h-full w-full inset-0 max-w-[600px] max-h-[600px]"
            alt={product.title}
          />
        </div>
     
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
