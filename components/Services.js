import React from 'react'
import { motion } from "framer-motion"

const Services = () => {
  return (
    <section className='mb-40'>
        <div>
            <div className='py-12 text-5xl flex justify-center font-semibold '>
                <span className='bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent p-2 border-b-2 border-slate-600 pb-3'>Services</span>
            </div>
            <div className='text-center font-rubik text-slate-600 pb-10'>
                <motion.p
                  whileInView={{opacity:1, x:0}}
                  initial={{x : -100, opacity : 0}}
                  transition = {{duration : 0.7 , delay : 0}} 
                  className='tracking-widest'
                >
                    Services I Offer.
                </motion.p>
            </div>

            <div className='flex flex-wrap justify-evenly'>    

                        <motion.div 
                          initial={{
                              scale: 0,
                              rotate: 0, 
                            }}
                          whileInView={{
                              scale: 1,
                              rotate: 0, 
                            }} 
                          transition = {{duration : 0.5 , delay : 0}}
                          className='m-2 p-5 text-center justify-center items-center shadow-lg shadow-slate-300 rounded-lg '
                        >
                          <img 
                            src="images/designing.webp"
                            width={350}
                            height={250}
                            className='m-auto mt-10'
                          />
                          <h3 className='py-5 text-2xl font-semibold text-slate-800 '>Beautiful Design</h3>
                          <p className='text-slate-800 tracking-wide text-center lg:w-96'>Creating elegant design suited for your needs following core design theory.</p>
                        </motion.div>


                        <motion.div 
                          initial={{
                              scale: 0,
                              rotate: 0, 
                            }}
                          whileInView={{
                              scale: 1,
                              rotate: 0, 
                            }} 
                          transition = {{duration : 0.5 , delay : 0}}
                          className='m-2 p-5 text-center justify-center items-center shadow-lg shadow-slate-300 rounded-lg '
                        >
                          <img 
                            src="images/coding.webp"
                            width={350}
                            height={250}
                            className='m-auto mt-10 '
                          />
                          <h3 className='py-5 text-2xl font-semibold text-slate-800 '>Code your Dream project</h3>
                          <p className='text-slate-800 tracking-wide text-center lg:w-96'>Translating complex requirements into intuitive, user-friendly applications using modern technologies.</p>
                        </motion.div>
                        

                        <motion.div 
                          initial={{
                              scale: 0,
                              rotate: 0, 
                            }}
                          whileInView={{
                              scale: 1,
                              rotate: 0, 
                            }} 
                          transition = {{duration : 0.5 , delay : 0}}
                          className='m-2 p-5 text-center justify-center items-center shadow-lg shadow-slate-300 rounded-lg'
                        >
                          <img 
                            src="images/consulting.webp"
                            width={350}
                            height={250}
                            className='m-auto mt-10 '
                          />
                          <h3 className='py-5 text-2xl font-semibold text-slate-800 '>Consulting</h3>
                          <p className='text-slate-800 tracking-wide text-center lg:w-96'>Giving you strategic advice to boost innovation and efficiency.</p>
                        </motion.div>
               
            </div>
        </div>  
    </section>
  )
}

export default Services
