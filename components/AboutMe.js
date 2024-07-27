import React from 'react'
import { motion } from "framer-motion"

const AboutMe = () => {
  return (
    
     <section className='mb-20 pt-10'>

        <motion.div          
          className='text-center text-slate-800 font-semibold text-[42px] mb-20'>
            <span className='border-b-2 border-slate-600 pb-2'>About <span className='text-slate-500 font-bold'>Me</span></span>
        </motion.div>

        <div className='flex flex-wrap'>

            <motion.div 
                whileInView={{opacity:1, x:0}}
                initial={{x : -100, opacity : 0}}
                transition = {{duration : 0.5 , delay : 0}}
                className='w-full lg:w-1/2 lg:p-8'>
                    <div className='flex justify-center items-center '>
                        <img src="images/Aboutme.webp" alt="" className='rounded-2xl w-96 h-[460px]'/>
                    </div>
            </motion.div>

            <div                 
                className='w-full lg:w-1/2 '>
                    <div className='flex justify-center lg:justify-start '>
                    <motion.p 
                    whileInView={{opacity:1, x:0}}
                    initial={{x : -100, opacity : 0}}
                    transition = {{duration : 0.5 , delay : 0}}
                    className='my-2 max-w-xl py-6 text-slate-700 tracking-wide leading-7 '>Hi! I'm Mian Usman Sarfraz, a passionate React.js developer with a sharp eye for design and a knack for problem-solving. I specialize in crafting seamless web experiences by blending aesthetic appeal with technical functionality. Dedicated to writing clean, efficient code, I thrive on creating user-centric applications that are both innovative and intuitive. With a strong commitment to continuous learning and collaboration, I aim to exceed expectations and bring visions to life through engaging and interactive user interfaces. Outside of work, I enjoy exploring new technologies and contributing to open-source projects, keeping me connected with the vibrant developer community. Proficient in Tailwind CSS, I ensure that every design is both responsive and visually compelling. My skills extend to leveraging various modern tools and libraries to enhance performance and user engagement. Let's create something amazing together and push the boundaries of what's possible in the digital world!</motion.p>
                    </div>                
            </div>

        </div>

     </section> 
    
  )
}

export default AboutMe
