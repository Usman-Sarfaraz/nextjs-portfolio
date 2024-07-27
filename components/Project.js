import React from "react";
import { motion } from "framer-motion"

const Project = () => {
  return (
    <section className="mb-24 ">

        <div className="py-12 text-5xl flex justify-center font-semibold ">
          <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent p-2 border-b-2 border-slate-600 pb-3">
            Projects
          </span>
        </div>

        <motion.div
          whileInView={{opacity:1, x:0}}
          initial={{x : -100, opacity : 0}}
          transition = {{duration : 0.5 , delay : 0}}
          className="text-center font-rubik text-slate-600 mb-24">
            <p className="tracking-widest">Some of my Projects.</p>
        </motion.div>

      <div>        
        <div className="mb-14 flex flex-wrap lg:justify-center">

          <div className="w-full lg:w-1/4">
            <motion.img 
                src="images/todo.webp" 
                alt="" 
                className="mb-4 rounded"
                height={250}
                width={280}
                whileInView={{opacity:1, x:0}}
                initial={{x : -100, opacity : 0}}
                transition = {{duration : 0.5 , delay : 0}}
            />
          </div>

          <div className="w-full max-w-xl lg:w3/4">

            <motion.h3
              initial={{
                    scale: 0,
                    rotate: 0, }}
              whileInView={{
                    scale: 1,
                    rotate: 0, 
                  }} 
              className="mb-2 font-semibold text-[22px] text-slate-800">
              
                Todo List

            </motion.h3>

            <motion.p 
                whileInView={{opacity:1, x:0}}
                initial={{x : -100, opacity : 0}}
                transition = {{duration : 0.5 , delay : 0}} 
                className="mb-5 text-slate-600 tracking-wide max-w-xs lg:max-w-xl ">Developed a user-friendly TODO list app allowing smooth task creation, editing, and deletion for effective task management. Incorporated CRUD operations to give users complete control over their tasks,boosting productivity.                
            </motion.p>

            <motion.div 
              initial={{
                    scale: 0,
                    rotate: 0, }}
              whileInView={{
                    scale: 1,
                    rotate: 0, 
                  }} 
            >
              <span className="mr-2 bg-slate-500 text-slate-100 rounded px-2 py-1 ">HTML</span>
              <span className="mr-2 bg-slate-500 text-slate-100 rounded px-2 py-1 ">CSS</span>
              <span className="mr-2 bg-slate-500 text-slate-100 rounded px-2 py-1 ">React</span>
              <span className="mr-2 bg-slate-500 text-slate-100 rounded px-2 py-1 ">React Bootstrap</span>
            </motion.div>

          </div>

        </div>
      </div>
    
      <div>        
        <div className="mb-14 flex flex-wrap lg:justify-center">

          <div className="w-full lg:w-1/4">
            <motion.img 
                src="images/resturant.webp" 
                alt="" 
                className="mb-4 rounded"
                height={150}
                width={280}
                whileInView={{opacity:1, x:0}}
                initial={{x : -100, opacity : 0}}
                transition = {{duration : 0.5 , delay : 0}}
            />
          </div>

          <div className="w-full max-w-xl lg:w3/4">
            <motion.h3
              initial={{
                      scale: 0,
                      rotate: 0, }}
                whileInView={{
                      scale: 1,
                      rotate: 0, 
                    }}  
              className="mb-2 font-semibold text-[22px] text-slate-800">Basic Restaurant Website

            </motion.h3>

            <motion.p 
              whileInView={{opacity:1, x:0}}
              initial={{x : -100, opacity : 0}}
              transition = {{duration : 0.5 , delay : 0}} 
              className="mb-4 text-slate-600 tracking-wide max-w-xs lg:max-w-xl"
            >
              Made a user-friendly restaurant project leveraging API data for a seamless experience. Users can effortlessly explore and select restaurant options, enhancing dining choices and convenience. This project helps users discover restaurants based on location, cuisine, and ratings. With a simple and user-friendly interface, users can easily browse options and see essential details like addresses and contact information. It makes choosing a place to eat quick and straightforward, perfect for anyone looking for a convenient dining experience.
              
            </motion.p>

            <motion.div
            initial={{
                    scale: 0,
                    rotate: 0, }}
            whileInView={{
                    scale: 1,
                    rotate: 0, 
                  }} 
            className="max-w-xs lg:max-w-xl"
            >
              <span className="mr-2 bg-slate-500 text-slate-100 rounded px-2 py-1 ">HTML</span>
              <span className="mr-2 bg-slate-500 text-slate-100 rounded px-2 py-1 ">CSS</span>
              <span className="mr-2 bg-slate-500 text-slate-100 rounded px-2 py-1 ">React</span>
              <span className="mr-2 bg-slate-500 text-slate-100 rounded px-2 py-1 ">React Bootstrap</span>
            </motion.div>
          </div>

        </div>
      </div>

      <div>        
        <div className="mb-8 flex flex-wrap lg:justify-center">

          <div className="w-full lg:w-1/4">
            <motion.img 
                src="images/miniApp.webp"
                alt="" 
                className="mb-4 rounded"
                height={250}
                width={280}
                whileInView={{opacity:1, x:0}}
                initial={{x : -100, opacity : 0}}
                transition = {{duration : 0.5 , delay : 0}}
            />
          </div>

          <div className="w-full max-w-xl lg:w3/4">

            <motion.h3 
              initial={{
                      scale: 0,
                      rotate: 0, }}
                whileInView={{
                      scale: 1,
                      rotate: 0, 
                    }}  
              className="mb-2 font-semibold text-[22px] text-slate-800">

                Mini React webpage
            </motion.h3>

            <motion.p 
              whileInView={{opacity:1, x:0}}
              initial={{x : -100, opacity : 0}}
              transition = {{duration : 0.5 , delay : 0}} 
              className="mb-5 text-slate-600 tracking-wide max-w-xs lg:max-w-xl">
                In this project, I've built a dynamic page with interactive cards that users can freely drag and move around the screen using Framer Motion. This enhances the user experience with smooth animations and showcases how to integrate React with Framer Motion for creating engaging and interactive web apps.
            </motion.p>

            <motion.div
              initial={{
                      scale: 0,
                      rotate: 0, }}
              whileInView={{
                      scale: 1,
                      rotate: 0, 
                    }} 
            >
              <span className="mr-2 bg-slate-500 text-slate-100 rounded px-2 py-1 ">HTML</span>
              <span className="mr-2 bg-slate-500 text-slate-100 rounded px-2 py-1 ">CSS</span>
              <span className="mr-2 bg-slate-500 text-slate-100 rounded px-2 py-1 ">React</span>
              <span className="mr-2 bg-slate-500 text-slate-100 rounded px-2 py-1 ">Tailwind</span>
              <span className="mr-2 bg-slate-500 text-slate-100 rounded px-2 py-1 ">Framer Motion</span>
            </motion.div>
          </div>

        </div>
      </div>


    </section>
  );
};

export default Project;
