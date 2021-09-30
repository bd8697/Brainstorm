import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import classes from "./SearchTerm.module.css";
import eTerm from "../Entities/Term";
import { useRouter } from "next/dist/client/router";
import Star from "./Star";
import ButtonsContainer from './ButtonsContainer'
import ButtonOnHover from "./ButtonOnHover";
import { global } from '../Utility/Utility'
import Transform from "../Entities/Transform";
import { Btn } from "../Utility/MuiCompsStyles";
import SearchIcon from '@material-ui/icons/Search';
import Toast from "./Toast";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import TextCard from "./TextCard";
import Input from './Input'
import { getMostPopularTerm, getRandomTerm, getTermCount, postTerm } from "../Utility/HttpRequests";
import Loading from "./Loading";

export const SearchTerm = () => {
  const router = useRouter()
  const [searchTermTransform, setSearchTermTransform] = useState(global.defaultTransform)
  const [helpStarTransform, setHelpStarTransform] = useState(global.defaultTransform)
  const [randomTermTransform, setRandomTermTransform] = useState(global.defaultTransform)
  const [popularTermTransform, setPopularTermTransform] = useState(global.defaultTransform)
  const [helpTransform, setHelpTransform] = useState(global.defaultTransform)
  const [activeStarName, setActiveStarName] = useState("")
  const [httpError, setHttpError] = useState(null);
  const searchedTerm = useRef<HTMLInputElement>(null)
  const [renderToast, setRenderToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [helpText, setHelpText] = useState(global.helpText)
  const searchAnim = useAnimation()
  const [anim, setAnim] = useState<any>({
    spin: {
      rotate: [0, 360],
      transition: { ease: "easeInOut", duration: 2 },
    },
    unspin: {
      rotate: [0, -360 * 2],
      transition: { ease: "easeInOut", duration: 2 },
    },
});
  
  useEffect(() => {
    const windowDimensions = {width: window.innerWidth, height: window.innerHeight}
    setSearchTermTransform(new Transform(windowDimensions.width / 2, windowDimensions.height / 2, windowDimensions.width / 10, true))
    setRandomTermTransform(new Transform(windowDimensions.width / 4, windowDimensions.height / 2, windowDimensions.width / 15, true))
    setPopularTermTransform(new Transform(windowDimensions.width * 3 / 4, windowDimensions.height / 2, windowDimensions.width / 15, true))
    const margin = windowDimensions.height / 10
    setHelpStarTransform(new Transform(windowDimensions.width - margin, windowDimensions.height - margin, windowDimensions.width / 25, true))
    setHelpTransform(new Transform(windowDimensions.width, windowDimensions.height - windowDimensions.height / 6, windowDimensions.height / 4, false))
  }, []);

  useEffect(() => {
    if(searchTermTransform.render === true) {
      searchAnim.start("spin")
    } 
    else {
      searchAnim.start("unspin");
    }
  }, [searchTermTransform])

  useEffect(() => {
    const awaitTermCount = async() => {
      const response = await getTermCount()
      if(!response.ok) {
        return "error"
      } else {
        const termsCount = await response.json();
        const termsCountText = `We have ${termsCount} terms. Add the next one!`
        setHelpText((oldHelpText) => {
          return oldHelpText.concat(termsCountText)
        })
      }
    }
    awaitTermCount()
  }, [])

  const onNewTerm = (name: string) => {
      setTimeout(() => {
        router.push("/term/" + name.toLowerCase())
      }, global.fadeOutTermDuration * 1000); 
  }

  const onSearch = async () => {
    const name = searchedTerm.current?.value
    if(name) {
      setSearchTermTransform((transform) => {return {...transform, render: false}})
      searchedTerm.current!.value = ""
      onNewTerm(name)
    } else {
      setToastMessage("Invalid name.")
      setRenderToast(true)
    }
  };

  const setActiveName = useCallback((name: string) => {
    setActiveStarName(name);
  }, []);

  const showHideHelp = useCallback(() => { //todo: try without callback
    setHelpTransform((latestHelpTransform) => {return {...latestHelpTransform, render: !latestHelpTransform.render}})
  },[])

  const onInputError = () => {
      setToastMessage("Sorry, only one word.")
      setRenderToast(true)
  }

  const hideToast = () => {
    setRenderToast(false)
  }

  const onRandomTerm = async () => {
    setLoading(true)
    setSearchTermTransform((transform) => {return {...transform, render: false}})
    const response = await getRandomTerm()
    if(!response.ok) {
      setHttpError(response.message);
      setToastMessage(response.message)
      setRenderToast(true)
    } else {
      const responseTerm = await response.json();
      onNewTerm(responseTerm.name)
    }
}

  const onPopularTerm = async () => {
    setLoading(true)
    setSearchTermTransform((transform) => {return {...transform, render: false}})
    const response = await getMostPopularTerm()
    if(!response.ok) {
      setHttpError(response.message);
      setToastMessage(response.message)
      setRenderToast(true)
    } else {
      const responseTerm = await response.json();
      onNewTerm(responseTerm.name)
    }
  }

  return (
    <Fragment>
    <Loading render = {loading}></Loading>
    <AnimatePresence>
    {searchTermTransform.render && (
    <motion.div className={classes.searchPage}
    exit={{
      opacity: 0,
      scale: 1.5,
      transition: { ease: "easeInOut", duration: global.fadeOutTermDuration }
    }}>
    <motion.div className= {classes.searchStar}
      animate={searchAnim}
      variants={anim}>
          <Star
           name={"searchStar"}
           img={global.blackhole}
           render={searchTermTransform.render}
           transform={searchTermTransform}
           setActiveName={setActiveName}
           ignoreChildren={true}
           >
             <Input name = "Search" ref = {searchedTerm} onInputError = {onInputError}></Input>
          </Star>
          <ButtonsContainer>
            <ButtonOnHover
            render={activeStarName === "searchStar"}
            transform={searchTermTransform}
            name={"addBranch"}
            popBy={{
              x: 0,
              y: -searchTermTransform.size,
            }}
            onClick={() => {}}>
              <Btn onClick={onSearch}>
                  <SearchIcon/>
               </Btn>
            </ButtonOnHover>
          </ButtonsContainer>
          </motion.div>
        <Star
           name={"Random"}
           img={global.star1}
           render={randomTermTransform.render}
           transform={randomTermTransform}
           setActiveName={setActiveName}
           onAction={onRandomTerm}
           >
          </Star>
          <Star
           name={"Popular today"}
           img={global.star1}
           render={popularTermTransform.render}
           transform={popularTermTransform}
           setActiveName={setActiveName}
           onAction={onPopularTerm}
           >
          </Star>
          <div className="helpStar">
          <Star
           name={"helpStar"}
           img={global.blackhole}
           render={searchTermTransform.render}
           transform={helpStarTransform}
           setActiveName={setActiveName}
           ignoreChildren={true}
           >
            <Btn onClick={showHideHelp}>
              <HelpOutlineIcon />
            </Btn>
          </Star>
          </div>
          <TextCard transform={helpTransform} text = {helpText}></TextCard>
      {httpError && <p style={{ color: "red" }}>{httpError}</p>}
      <Toast render = {renderToast} hideToast = {hideToast} message = {toastMessage}></Toast>
    </motion.div> 
     )}
    </AnimatePresence>
    </Fragment>
  );
};
