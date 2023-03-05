import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './Extra.module.css';

import personal_image from '../../assets/Images/About-image.jpg';


export default function About() {

    const navigate = useNavigate();
    
    const handleClickBack = () => navigate(-1);

    const [lenguage, setLenguage] = useState({
        spanish: true
    });

    const handleChangeLeng = () => {
        setLenguage({spanish: !lenguage.spanish});
    }
  
    return ( 

        <div className={styles.container}>

            <div className={styles.item} style={{backgroundColor: 'transparent', backdropFilter: 'none'}}>
                <button onClick={handleClickBack}>
                    <i className='fa fa-chevron-left' aria-hidden='true'></i>
                </button>

                <button onClick={handleChangeLeng}>
                <i className='fas fa-redo-alt'></i>
                {lenguage.spanish ? '  English ' : '  Spanish '}
                </button>
            </div>

            <div className={styles.item}>
                <div>
                    <img src={personal_image} alt='creator_image'/>
                </div>

                <div className={styles.item_description}>     
                    <h2>Emanuel Guillermo Marquez</h2>

                    {lenguage.spanish 
                        ? <h4>
                            Bienvenidos a mi app de recetas desarrollada en el marco del curso FullStack Web Developer de Henry, espero sea de su agrado y puedan disfrutarla tanto como yo disfrute el proceso de creación, especialmente la parte del Front End.
                        </h4>
                        : <h4>
                            Welcome to my recipe app developed as part of Henry's FullStack Web Developer course, I hope you like it and you can enjoy it as much as I enjoy the creation process, especially the Front End part.
                        </h4>
                    }

                    {lenguage.spanish 
                        ? <h5>
                            Además de gustarme el mundo de la programación y la informática, también soy abogado graduado en la Universidad Nacional del Litoral {'(Santa Fe, Argentina)'} en ejercicio de la profesión. No dudes en contactarte por asesoramiento tech o legal.
                        </h5>
                        : <h5>
                            In addition to liking the world of programming and computing, i am also a lawyer graduated from the Universidad Nacional del Litoral {'(Santa Fe, Argentina)'} practicing my profession. Do not hesitate to contact you for tech or legal advice.
                        </h5>
                    }
                </div>

            </div>
            

            <div className={styles.info}>

                {lenguage.spanish
                    ? <h5>Pueden seguirme en mis redes:</h5>
                    : <h5>You can follow me on:</h5>
                }
                
                <div className={styles.redes}>

                    <div className={styles.redes}>
                    <i className='fab fa-instagram'></i><a href="https://www.instagram.com/emaamarqez">Instagram/EmanuelMarquez</a>
                    </div>
                    
                    <div className={styles.redes}>    
                    <i className='fab fa-linkedin'></i><a href="https://www.linkedin.com/in/emanuelmarquez">Linkedin/EmanuelMarquez</a>
                    </div>
                    
                    <div className={styles.redes}>    
                    <i className='fab fa-github'></i><a href="https://github.com/EmanuelGuillermoMarquez">GitHub/EmanuelMarquez</a>
                    </div>
                    <div className={styles.redes}>    
                    <i className='fas fa-envelope'></i><a href="mailto: marquezema127@gmail.com">Gmail/EmanuelMarquez</a>
                    </div>

                </div>
            </div>
        </div>
    
   );

};