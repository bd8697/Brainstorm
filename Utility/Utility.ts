import BranchDTO from "../Entities/BranchDTO";
import eTerm from '../Entities/Term'
import eBranch from '../Entities/Branch'
import Transform from "../Entities/Transform";
import star from '../assets/img/bigstarcutlit.png'
import yellowPlanet from '../assets/img/yellow_planet.png'
import star1 from '../assets/img/star1.png'
import star2 from '../assets/img/star2.png'
import blackhole from '../assets/img/blackhole.png'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { getFingerprint } from './HttpRequests';
import Fingerprint from "../Entities/Fingerprint";

export const randomInt = (min: number, max: number) => { // max inclusive
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };
  
  export const random = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };
  
  export const randomArgs = (arr : number[]) => {
    let rndIdx = randomInt(0, arr.length - 1)
    return arr[rndIdx]
  }
  
  export const mapValToRange = (
    val: number,
    from_in: number,
    from_out: number,
    to_in: number,
    to_out: number
  ) => {
    const to = to_out - to_in
    let from = from_out - from_in
    if (from === 0) { // prevent / 0
      from = 0.001
    }
    return (to / from) * (val - from_in) + to_in
  };
  
  export const getWindowDimensions = () => {
      const { innerWidth: width, innerHeight: height } = window;
      return {
        width,
        height,
      };
    };
  
    export const getAsPercOf = (perc: number, of: number) => {
      return (perc / 100) * of;
    };

    export const branchFromBranchDTO = (transform: Transform, color: string, branchDTO: BranchDTO) => {
      const branch = new eBranch(branchDTO.id, branchDTO.name, branchDTO.upvotes, branchDTO.downvotes, branchDTO.termId, transform, color)
      return branch
    }

    export const branchDTOFromBranch = (branch: eBranch) => {
      const branchDTO = new BranchDTO(branch.id, branch.name, branch.upvotes, branch.downvotes, branch.termId)
      return branchDTO
    }

    export const shuffle = (arr: any[]) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = randomInt(0, i);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    export const shuffle2 = (arr: any[], arr2: any[]) => {
      for (let i = arr.length - 1; i > 0; i--) {
          const j = randomInt(0, i);
          [arr[i], arr[j]] = [arr[j], arr[i]];
          [arr2[i], arr2[j]] = [arr2[j], arr2[i]];
      }
  }

    const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(color => color.toString(16).padStart(2, '0')).join('')

    export const generateColors = (gradientLength: number) => {
          const channel1: number[] = []
          const channel2: number[] = []
          const channel3: number[] = []
          let ch1 = 64, ch2 = randomInt(64, 255), ch3 = 255;
          const decay = 191 * 2 / gradientLength;

          for (let i = 0; i < gradientLength; i++) {
              if (ch2 < 255) {
                  ch2 += decay;
                  if (ch2 > 255)
                  {
                      ch2 = 255;
                  }
              } else if (ch2 === 255 && ch3 > 64)
              {
                  ch3 -= decay;
                  if (ch3 < 64)
                  {
                      ch3 = 64;
                  }
              }
              if (ch3 === 64 && ch1 < 255)
              {
                  ch1 += decay;
              }

              channel1.push(Math.floor(ch1))
              channel2.push(Math.floor(ch2))
              channel3.push(Math.floor(ch3))
          }

          const channels = [channel1, channel2, channel3]
          shuffle(channels)

          return ChannelsToColors(channels, gradientLength);
      }

      const ChannelsToColors = (channels: number[][], gradientLength: number) => {
            const colors: string[] = []

            for (let i = 0; i < gradientLength; i++) {
                const hex = rgbToHex(channels[0][i], channels[1][i], channels[2][i])
                colors.push(hex)
            }
            return colors;
        }

    export const GetPosWithoutOverlap = (overlapWith: eBranch[]) => { // too slow
      const wW = window.innerWidth
      const wH = window.innerHeight
      let loops = 0
      let overlap = true
      let pos: {x: number, y: number}
      const size = getAsPercOf(random(10,10), wW);
      do {
        overlap = false
        pos = {x: random(wW / 10, wW - wW / 10), y: random(wH / 10, wH - wH / 10)}
        loops++
        if(loops > 50) {
          return {...pos, size}
        }
        overlapWith.map((obj) => {
          if(Math.abs(pos.y - obj.transform.y) < (obj.transform.size + size) / 2 / 2 || Math.abs(pos.x - obj.transform.x) < (obj.transform.size + size) / 2 / 2) {
            overlap = true;
            //break
          }
        })
      } while(overlap)
      return {...pos, size}
    } 

    export const splitInGrid = (segments: number, windowWidth: number, windowHeight: number) => {
      const wW = windowWidth
      const wH = windowHeight
      const lines = Math.ceil(Math.sqrt(segments))
      const cols = Math.ceil(segments / lines)
      const segmentDimensions = {width: wW / lines, height: (wH - wH / 10) / cols}
      const wOffset = segmentDimensions.width / 2
      const hOffset = segmentDimensions.height / 2
      let coords: {x:number, y: number}[] = []
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < lines; j++) {
          const x = wOffset + segmentDimensions.width * j + random(-segmentDimensions.width / 3.5, segmentDimensions.width / 3.5) 
          const y = hOffset + segmentDimensions.height * i + random(segmentDimensions.height / 7.5, segmentDimensions.height / 1.5)
          coords.push({x, y})
      }
    }

    reserveGrid(coords)
    global.gridCoords = coords
  }

  const reserveGrid = (coords: {x:number, y: number}[]) => {
    let rndIdx: number
    do {
      rndIdx = randomInt(0, Math.floor((coords.length - 1) / 2))
    } while (global.reservedGridIdxes.includes(rndIdx))
    global.reservedGridIdxes = global.reservedGridIdxes.concat(rndIdx, global.gridCells - 1 - rndIdx)
  }

  export const assignFingerprint = async () => {
    const fpJS = await FingerprintJS.load()
    const fp = await fpJS.get()
    const fingerprint = fp.visitorId
    const response = await getFingerprint(fingerprint)
    if(response.ok) {
      var responseFingerprint = await response.json()
      global.fingerprint = responseFingerprint
    }
  }

  export const freezeGlobal = () => {
    Object.freeze(global)
  }

  export const global = {
    gridCoords: <{x:number, y: number}[]>[],
    gridCells: 20,
    fadeOutTermDuration: 0.5,
    maxInputLength: 25,
    branchesPerPage: 10,
    branchSizeBounds: [5, 7.5],
    reservedGridIdxes: [7, 12],
    defaultTransform: new Transform(0,0,0,false),
    defaultTerm: new eTerm(0, "default", 0, []),
    fingerprint: new Fingerprint(0, "default"),
    blackhole,
    star1,
    star2,
    defaultSpringCfg: {
      type: "spring",
      damping: 100,
      stiffness: 250,
      bounce: 1,
    },
    helpText: ["Welcome to Brainstorm!", "Get suggestions that users like you think are most closely related to whatever term you can think of. It's an easy way to quickly get new ideas or just freshen up your memory.", "You have the power to add any suggestion you like, for any term, while also rating any existing ones.", "By clicking on any of the suggestions, you will select it as your new search-term.", "", "The original data was provided with the help of ConceptNet 5, from https://conceptnet.io, and is constantly modified and improved upon by people like you."]
  }