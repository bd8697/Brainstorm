// const hostPath = "https://localhost:44354/api"
const hostPath = "https://brainstormapi.azurewebsites.net/api"

const fetchResponse = async (path: string, method: string, body?: string) => {
    let response = await fetch(path, {
        method: method,
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((error) => {
         return error
      });
      return response
}

export const getTerms = async () => {
  return await fetchResponse(`${hostPath}/Terms`, "GET")
}

export const getTermCount = async () => {
  return await fetchResponse(`${hostPath}/Terms/Count`, "GET")
}

export const getRandomTerm = async () => {
  return await fetchResponse(`${hostPath}/Terms/Random`, "GET")
}

export const getMostPopularTerm = async () => {
  return await fetchResponse(`${hostPath}/Terms/Popular`, "GET")
}

export const postTerm = async (body: string) => {
    return await fetchResponse(`${hostPath}/Terms`, "POST", body)
  }

  export const getTerm = async (termName: string) => {
    return await fetchResponse(`${hostPath}/Terms/GetByName/${termName}`, "GET")
  }

  export const putTerm = async (termId: string, body: string) => {
    return await fetchResponse(`${hostPath}/Terms/${termId}`, "PUT", body)
  }

  export const putBranch = async (branchId: number, body: string) => {
    return await fetchResponse(`${hostPath}/Branches/${branchId}`, "PUT", body)
  }

  export const getBranch = async (branchName: string, termId: number) => {
    return await fetchResponse(`${hostPath}/Terms/${branchName}/${termId}`, "GET")
  }

  export const postBranch = async (body: string) => {
    return await fetchResponse(`${hostPath}/Branches`, "POST", body)
  }

    export const getFingerprint = async (name: string) => {
    return await fetchResponse(`${hostPath}/Fingerprints/${name}`, "GET")
  }

  export const getVote = async (fingerprintId: number, branchId: number) => {
    return await fetchResponse(`${hostPath}/Votes/${fingerprintId}/${branchId}`, "GET")
  }

  export const postVote = async (body: string) => {
    return await fetchResponse(`${hostPath}/Votes`, "POST", body)
  }

