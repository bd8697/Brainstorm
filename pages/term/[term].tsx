import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ButtonOnHover from "../../comps/ButtonOnHover";
import ButtonsContainer from "../../comps/ButtonsContainer";
import Star from "../../comps/Star";
import eBranch from "../../Entities/Branch";
import BranchDTO from "../../Entities/BranchDTO";
import eTerm from "../../Entities/Term";
import Transform from "../../Entities/Transform";
import { Btn } from "../../Utility/MuiCompsStyles";
import {
  branchDTOFromBranch,
  branchFromBranchDTO,
  generateColors,
  getAsPercOf,
  mapValToRange,
  random,
  randomInt,
  shuffle2,
} from "../../Utility/Utility";
import { global } from "../../Utility/Utility";
import { randomArgs } from "./../../Utility/Utility";
import FastForwardIcon from '@material-ui/icons/FastForward';
import AddIcon from '@material-ui/icons/Add';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import StarData from "../../comps/StarData";
import Toast from "../../comps/Toast";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import Input from "../../comps/Input";
import { getBranch, getTerm, getVote, postBranch, postVote, putTerm } from "../../Utility/HttpRequests";
import { putBranch } from './../../Utility/HttpRequests';
import classes from './[term].module.css'
import Loading from "../../comps/Loading";
import SearchIcon from '@material-ui/icons/Search';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import Vote from "../../Entities/Vote";
import { Tooltip, Zoom } from "@material-ui/core";

const Term = (props: { termName: string }) => {
  const [term, setTerm] = useState(global.defaultTerm);
  const [allBranches, setAllBranches] = useState<BranchDTO[]>([])
  const allBranchesRef = useRef<BranchDTO[]>([]);
  allBranchesRef.current = allBranches
  const [branchSet, setBranchSet] = useState<number>(-1);
  const [termTransform, setTermTransform] = useState(global.defaultTransform)
  const [addBranchTransform, setAddBranchTransform] = useState(global.defaultTransform)
  const [searchTermTransform, setSearchTermTransform] = useState(global.defaultTransform)
  const [httpError, setHttpError] = useState(null);
  const [activeStarName, setActiveStarName] = useState<string>("");
  const newBranchRef = useRef<HTMLInputElement>(null)
  const searchTermRef = useRef<HTMLInputElement>(null)
  const [inputError, setInputError] = useState("")
  const [renderToast, setRenderToast] = useState(false)
  const [render, setRender] = useState(true)
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  const termAnim = useAnimation()
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
    setTermTransform(new Transform(windowDimensions.width / 2, windowDimensions.height / 2, windowDimensions.width / 10, true))
  }, []);

  useEffect(() => {
    const size = getAsPercOf(7, window.innerWidth);
    let pos = global.gridCoords[global.reservedGridIdxes[global.reservedGridIdxes.length - 1]]
    pos ??= {x: 0, y: 0} // if undefined
    setAddBranchTransform(new Transform(pos.x, pos.y, size, true))
    setSearchTermTransform(new Transform(window.innerWidth - pos.x, window.innerHeight - pos.y, size, true))
}, [global.gridCoords])

useEffect(() => {
  if(allBranches.length > 0) {
  const branchesToSetUp = allBranches.slice(branchSet, branchSet + global.branchesPerPage)
  let branchesForComp: eBranch[] = [];
  const gridCoords = global.gridCoords
  const enabledGridSegments: boolean[] = [];
  for (let i = 0; i < gridCoords.length; i++) {
    enabledGridSegments.push(true);
  }
  global.reservedGridIdxes.map((idx) => {
    enabledGridSegments[idx] = false;
  }); // keep center clear, to display term UI, also ignore reserved grid cells.
  for (
    let i = 0;
    i <
    gridCoords.length -
      global.reservedGridIdxes.length -
      branchesToSetUp.length;
    i++
  ) {
    let rndIdx = randomArgs(
      enabledGridSegments.flatMap((enabled, idx) => (enabled ? idx : []))
    );
    enabledGridSegments[rndIdx] = false;
  }
  let gridIterator = -1;

  let scores: number[] = []
  branchesToSetUp.map((branch: BranchDTO) => {
  const score = branch.upvotes - branch.downvotes
  scores.push(score)
  })
  const minScore = Math.min(...scores)
  const maxScore = Math.max(...scores)
  const colors = generateColors(branchesToSetUp.length)
  shuffle2(branchesToSetUp, colors)
  branchesToSetUp.map((branch: BranchDTO) => { // expect to get branches sorted by descending score
    do {
      gridIterator++;
    } while (enabledGridSegments[gridIterator] === false) 
    const pos = gridCoords[gridIterator];
    const score = branch.upvotes - branch.downvotes
    const scoreAsPerc = mapValToRange(score, minScore, maxScore, global.branchSizeBounds[0], global.branchSizeBounds[1])
    const size = getAsPercOf(scoreAsPerc, window.innerWidth);
    const transform = new Transform(pos.x, pos.y, size, true);
    const color = colors.shift() ?? ''
    const branchForComp: eBranch = branchFromBranchDTO(transform, color, branch);
    branchesForComp = branchesForComp.concat(branchForComp);
  });
  setTerm((latestTerm) => { return {...latestTerm, branches: latestTerm.branches.concat(branchesForComp)}});
  termAnim.start("spin");
}
}, [branchSet])

  useEffect(() => {
    const loadTerm = async () => {
      // await new Promise(r => setTimeout(r, 5000));
      let response = await getTerm(props.termName)
      if(!response.ok) {
        setHttpError(response.message);
        setInputError(response.message)
        setRenderToast(true)
      }
      else if (response) {
        const responseTerm = await response.json();
        setAllBranches(responseTerm.branches)
        responseTerm.branches = []
        responseTerm.visits++
        setTerm(responseTerm)
        setBranchSet(0)

        response = await putTerm(responseTerm.id, JSON.stringify(responseTerm))
        if(!response.ok) {
          setHttpError(response.message);
          setInputError(response.message)
          setRenderToast(true)
        }
      }
      setLoading(false)
    };
    loadTerm();
  }, []);

  const onNextBranchSet = () => {
    saveLastBranchSet()
    setBranchSet((branchSet) => branchSet + global.branchesPerPage);
  };

  const onPreviousBranchSet = () => {
    if(branchSet !== 0) {
      saveLastBranchSet()
      setBranchSet((latestbranchSet) => Math.max(latestbranchSet - global.branchesPerPage, 0));
    }
  }

  const saveLastBranchSet = () => {
    const exitingBranches = term.branches;
    exitingBranches.map((branch) => (branch.transform.render = false));
    termAnim.start("spin");
    setActiveStarName("");
    setTerm((prevTerm) => {
      const newTerm = prevTerm;
      newTerm.branches = exitingBranches;
      return newTerm;
    });
  }

  const onVote = useCallback(async (branch: eBranch, up: boolean) => {
    let response = await getVote(global.fingerprint.id, branch.id)
    if(response.status === 404) {
      let multi
      up? branch.upvotes++ : branch.downvotes++
      up ? multi = 1.01 : multi = 0.99
      branch.transform = {...branch.transform, size: branch.transform.size * multi}
      const branchDTO = branchDTOFromBranch(branch)
      response = await putBranch(branchDTO.id, JSON.stringify(branchDTO))
      if(!response.ok) {
        setHttpError(response.message);
        setInputError(response.message)
        setRenderToast(true)
      }
      setActiveName("")
      const newVote = new Vote(global.fingerprint.id, branchDTO.id)
      response = await postVote(JSON.stringify(newVote))
      if(!response.ok) {
        setHttpError(response.message);
        setInputError(response.message)
        setRenderToast(true)
      }
    } 
    else if (!response.ok) {
      setHttpError(response.message);
      setInputError(response.message)
      setRenderToast(true)
    } 
    else if(response.ok) {
      setInputError("Sorry, already voted.")
      setActiveStarName("");
      setRenderToast(true)
    }
  }, [])

  const onNewTerm = useCallback(async (termName: string) => {
      termAnim.start("unspin");
      setRender(false)
      setTimeout(() => { // wait for current page to unload
        router.push("/term/" + termName)
      }, global.fadeOutTermDuration * 1000);
  }, []);

  const onAddBranch = useCallback(async () => {
    let latestTerm = term; // always the term set in the state initializer
    setTerm((prevTerm) => {
      latestTerm = prevTerm;
      return prevTerm;
    }); // only way to get the latest term state within a callback. Ugly af, react...
    let branchExists = false;
    latestTerm.branches.map((branch) => {if(branch.name === newBranchRef.current?.value) {branchExists = true}})
    if(newBranchRef.current?.value === '' || newBranchRef.current?.value === latestTerm.name || branchExists) {
      setRenderToast(true)
      setInputError("Invalid name.")
    }
    else {
    setActiveStarName("")
    const newBranchName = newBranchRef.current!.value

    let rndIdx = 0
      let transform = new Transform(0, 0, 0 , true)
      let color = "yellow"
      if(latestTerm.branches.length > 0) { // if no other branchStars, create a new one, otherwise replace an old one (for now)
        rndIdx = randomInt(0, latestTerm.branches.length - 1);
        const pos = {
          x: latestTerm.branches[rndIdx].transform.x,
          y: latestTerm.branches[rndIdx].transform.y,
        };
        const size = latestTerm.branches[rndIdx].transform.size;
        transform = new Transform(pos.x, pos.y, size, true);
        color = latestTerm.branches[rndIdx].color
        latestTerm.branches[rndIdx].transform.render = false;
      } else {
        do {
          rndIdx = randomInt(0, global.gridCoords.length - 1)
        } while(global.reservedGridIdxes.includes(rndIdx))
        const pos = global.gridCoords[rndIdx]
        const sizeAsPerc = (global.branchSizeBounds[0] + global.branchSizeBounds[1]) / 2
        const size = getAsPercOf(sizeAsPerc, window.innerWidth);
        transform = new Transform(pos.x, pos.y, size, true);
        color = generateColors(1).pop() ?? ''
      }

    const branchInAllBranches = allBranchesRef.current.find(branch => {
      return branch.name === newBranchName.toLowerCase()
    })
    if(branchInAllBranches) {
      const addedBranch = branchFromBranchDTO(transform, color, branchInAllBranches);
      const newTerm = { ...latestTerm }; // shallow copy, but enaugh to trigger rerender
      newTerm.branches = newTerm.branches.concat(addedBranch);
      setTerm(newTerm);
    }
    else if(!branchInAllBranches) {
      const newBranch = new BranchDTO(0, newBranchName.toLowerCase(), 1, 0, latestTerm.id)
      const response = await postBranch(JSON.stringify(newBranch));
      if(!response.ok) { // (ok = 200 -> 299)
      setHttpError(response.message);
      setInputError(response.message)
      setRenderToast(true)
    } 
    if (response) {
      const responseBranch = await response.json(); // we need the id generated in the db
      setAllBranches((allBranches) => {return allBranches.concat(responseBranch)})
      const addedBranch = branchFromBranchDTO(transform, color, responseBranch);
      const newTerm = { ...latestTerm }; // shallow copy, but enaugh to trigger rerender
      newTerm.branches = newTerm.branches.concat(addedBranch);
      setTerm(newTerm);
    }
    }
    termAnim.start("spin")
  }
  newBranchRef.current!.value = ""
  }, []);

  const onSearchTerm = useCallback(async () => {
    const name = searchTermRef.current?.value
    if(name) {
      searchTermRef.current!.value = ""
      let latestTerm = term;
      setTerm((prevTerm) => {
        latestTerm = prevTerm;
        return prevTerm;
      });
      if(name !== latestTerm.name) {
        termAnim.start("unspin");
        setRender(false)
        setTimeout(() => { // wait for current page to unload
          router.push("/term/" + name)
        }, global.fadeOutTermDuration * 1000);
      }
    } else {
      setInputError("Invalid name.")
      setRenderToast(true)
    }
  }, []);

  const onBranchStarDelete = useCallback((name: string) => {
    // need useCallback to stop rerendering children if props dont change. also need to get current oldState in setTerm (I suppose "term" references the initial term state because the function reference never changes due to useCallback ?)
    setTerm((oldTerm) => {
      const newTerm = {
        ...oldTerm,
        branches: oldTerm.branches.filter((branch) => branch.name !== name),
      };
      return newTerm;
    });
  }, []);

  const setActiveName = (name: string) => {
    const branch = term.branches.find(branch => {
      return branch.name === name
    })
    if(branch?.transform.render === false) {
      return;
    }
    setActiveStarName(name);
  }

  const hideToast = () => {
    setRenderToast(false)
  }

  const onInputError = () => {
    setInputError("Sorry, only one word.")
    setRenderToast(true)
  }

  return (
    <AnimatePresence>
      {render &&
        <motion.div className = {classes.starContainer}
    exit={{
      opacity: 0,
      scale: 1.5,
      transition: { ease: "easeInOut", duration: global.fadeOutTermDuration }
    }}>
      <Loading render = {loading}></Loading>
      {term.id !== 0 &&
      <motion.div className= {classes.termStar}
      animate={termAnim}
      variants={anim}>
          <Star
           name={term.name}
           img={global.blackhole}
           render={termTransform.render}
           transform={termTransform}
           setActiveName={setActiveName}
           >
          </Star>
          <ButtonsContainer>
            <ButtonOnHover
            render={activeStarName === term.name}
            transform={termTransform}
            name={term.name}
            popBy={{
              x: 0,
              y: termTransform.size / 1.5,
            }}>
              <Btn onClick={onNextBranchSet}>
                  <FastForwardIcon/>
               </Btn>
            </ButtonOnHover>
            <ButtonOnHover
            render={activeStarName === term.name}
            transform={termTransform}
            name={term.name}
            popBy={{
              x: 0,
              y: -termTransform.size / 1.5,
            }}>
              <Btn onClick={onPreviousBranchSet}>
                  <FastRewindIcon/>
               </Btn>
            </ButtonOnHover>
          </ButtonsContainer>
          </motion.div>
          }
          {term.id !== 0 &&
      <div className="addBranch">
          <Star
           name={"addBranch"}
           img={global.blackhole}
           render={addBranchTransform.render}
           transform={addBranchTransform}
           setActiveName={setActiveName}
           ignoreChildren={true}
           >
             <Input name = "Suggest" ref = {newBranchRef} onInputError = {onInputError}></Input>
          </Star>
          <ButtonsContainer>
            <ButtonOnHover
            render={activeStarName === "addBranch"}
            transform={addBranchTransform}
            name={"addBranch"}
            popBy={{
              x: 0,
              y: -termTransform.size / 1.5,
            }}>
                <Btn onClick={onAddBranch}>
                    <AddIcon fontSize = "small"/>
                </Btn>
            </ButtonOnHover>
          </ButtonsContainer>
        </div>
      }
            {term.id !== 0 &&
          <div className="searchTerm">
          <Star
           name={"searchTerm"}
           img={global.blackhole}
           render={searchTermTransform.render}
           transform={searchTermTransform}
           setActiveName={setActiveName}
           ignoreChildren={true}
           >
             <Input name = "Search" ref = {searchTermRef} onInputError = {onInputError}></Input>
          </Star>
          <ButtonsContainer>
            <ButtonOnHover
            render={activeStarName === "searchTerm"}
            transform={searchTermTransform}
            name={"searchTerm"}
            popBy={{
              x: 0,
              y:  termTransform.size / 1.5,
            }}>
                <Btn onClick={onSearchTerm}>
                  <SearchIcon/>
                </Btn>
            </ButtonOnHover>
          </ButtonsContainer>
        </div>
      }
      {term.branches.map((branch) => {
        return(
        <div className="branch" key={branch.name}>
          <Star
            name={branch.name}
            score = {branch.upvotes - branch.downvotes}
            color = {branch.color}
            img={Math.floor(branch.transform.x + branch.transform.y) % 2 === 0 ? global.star1 : global.star1}
            render={branch.transform.render}
            transform={branch.transform}
            setActiveName={setActiveName}
            onDelete={onBranchStarDelete}
            onAction={onNewTerm}
          >
          </Star>
          <ButtonsContainer>
          <ButtonOnHover
                  render={activeStarName === branch.name}
                  transform={branch.transform}
                  name={branch.name}
                  popBy={{
                    x: branch.transform.size / 1.25,
                    y: -branch.transform.size / 1.5,
                  }}
                >
                <Tooltip TransitionComponent={Zoom} enterDelay={1000} title={<p className= {classes.tooltip}>Downvote</p>} >
                  <Btn onClick={() => {onVote(branch, false)}}>
                    <KeyboardArrowDownIcon/>
                </Btn>
                </Tooltip>
                </ButtonOnHover>
                <ButtonOnHover
                  render={activeStarName === branch.name}
                  transform={branch.transform}
                  name={branch.name}
                  popBy={{
                    x: -branch.transform.size / 1.25,
                    y: -branch.transform.size / 1.5,
                  }}
                >
                  <Tooltip TransitionComponent={Zoom} enterDelay={1000} title={<p className= {classes.tooltip}>Upvote</p>} >
                  <Btn onClick={() => {onVote(branch, true)}}>
                    <KeyboardArrowUpIcon/>
                </Btn>
                </Tooltip>
                </ButtonOnHover>
          </ButtonsContainer>
        </div>
        )})}
    <Toast render = {renderToast} hideToast = {hideToast} message = {inputError}></Toast>
    </motion.div>
}
    </AnimatePresence>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { term: termName } = ctx.query;

  return { props: {termName , key: termName} }; // need a key to trigger rerender
};

// export const getStaticPaths = async () => {
//   return {
//     fallback: true,
//     paths: [
//         // { params: { term: '1' } }
//       ],
// }};

// export const getStaticProps: GetStaticProps = async (ctx) => {
//   const termName = ctx.query.term
//   return {
//     props: {
//     },
//   };
// };

export default Term;
