import React, {useEffect, useState} from 'react'
import backgroundImage from "../img/background.svg"
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import './start.css'
import Tooltip from '../components/Tooltip'
import Button from '../components/Button'
import JoinButton from '../components/JoinButton'
import User from '../contexts/User'
import backgroundVid from '../img/animation.mp4'

export default observer(() => {

    const [isloading, setIsLoading] = useState(false)

  useEffect(() => {
    document.body.style.backgroundImage = `url(${backgroundVid})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.minHeight = "100vh";

    return () => {
      // Reset the body background when the component is unmounted
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
    };
  }, []);

  const userContext = React.useContext(User)

  const handleJoin = async () => {
    if (!userContext.userState) return;
    setIsLoading(true);
    await userContext.signup();
    setIsLoading(false);
  };


    // if (!userContext.userState) {
    //     return (
    //     <div className="container">
    //         Loading...
    //     </div>
    //     )
    // }

    return (
 
        <div>
                <video
                   autoPlay
                   loop
                   muted
                   className="background-video"
                   src={backgroundVid}
                ></video>
                <div className="join">
                    {!userContext.hasSignedUp ? ( !isloading ? (
                        <div className='join-button'
                            onClick={() => {
                                if (!userContext.userState) return
                                setIsLoading(true)
                                return userContext.signup()
                            }}
                        >
                            <JoinButton text={userContext.userState ? 'Join' : 'Initializing...'} />
                        </div>
                    ): (
                        <div className='join-button'>
                            <JoinButton text={"Loading..."} />
                        </div>
                    )) : (
                        <div className='join-button'>
                            <p
                                style={{
                                    fontWeight: '400',
                                    lineHeight: '.5em',
                                }}
                            >
                                WELCOME!
                            </p>
                            <Link to="/forum">
                                <JoinButton text={"Forum"} />
                            </Link>
                        </div>
                    )}
                </div>
        </div>
    )
})
