import { apiEndpoint } from '../config'
import { Diary } from '../types/Diary';
import { CreateDiaryRequest } from '../types/CreateDiaryRequest';
import Axios from 'axios'
import { UpdateDiaryRequest } from '../types/UpdateDiaryRequest';
const list: Diary[] = [
  { "diaryId": "10", "title": "My Home", content: "Parse parses, validates, verifies the signature and returns the parsed token. keyFunc will receive the parsed token and should return the cryptographic key for verifying the signature. The caller is strongly encouraged to set the WithValidMethods option to validate the 'alg' claim in the token matches the expected algorithm. For more details about the importance of validating the 'alg' claim, see https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/", createdAt: "20/10/2022", urlImage: "https://th.bing.com/th/id/OIP.ObCoZ4Z_ffF0d01yTgHJFwHaE8?pid=ImgDet&rs=1" },
  { "diaryId": "11", "title": "My Home2", content: "Parse parses, validates, verifies the signature and returns the parsed token. keyFunc will receive the parsed token and should return the cryptographic key for verifying the signature. The caller is strongly encouraged to set the WithValidMethods option to validate the 'alg' claim in the token matches the expected algorithm. For more details about the importance of validating the 'alg' claim, see https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/", createdAt: "20/10/2022", urlImage: "https://th.bing.com/th/id/OIP.ObCoZ4Z_ffF0d01yTgHJFwHaE8?pid=ImgDet&rs=1" },
  { "diaryId": "12", "title": "My Home3", content: "Parse parses, validates, verifies the signature and returns the parsed token. keyFunc will receive the parsed token and should return the cryptographic key for verifying the signature. The caller is strongly encouraged to set the WithValidMethods option to validate the 'alg' claim in the token matches the expected algorithm. For more details about the importance of validating the 'alg' claim, see https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/", createdAt: "20/10/2022", urlImage: "https://th.bing.com/th/id/OIP.ObCoZ4Z_ffF0d01yTgHJFwHaE8?pid=ImgDet&rs=1" },
  { "diaryId": "13", "title": "My Home4", content: "Parse parses, validates, verifies the signature and returns the parsed token. keyFunc will receive the parsed token and should return the cryptographic key for verifying the signature. The caller is strongly encouraged to set the WithValidMethods option to validate the 'alg' claim in the token matches the expected algorithm. For more details about the importance of validating the 'alg' claim, see https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/", createdAt: "20/10/2022", urlImage: "https://th.bing.com/th/id/OIP.ObCoZ4Z_ffF0d01yTgHJFwHaE8?pid=ImgDet&rs=1" }
]
export async function getDiaries(idToken: string): Promise<Diary[]> {
  console.log('Fetching diaries')

  const response = await Axios.get(`${apiEndpoint}/diaries`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Diaries:', response.data)
  return response.data.items

}

export async function findDiariesByName(idToken: string, name: string): Promise<Diary[]> {
  console.log('findDiariesByName diaries')

  const response = await Axios.get(`${apiEndpoint}/diaries/search?name=${name}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Diaries:', response.data)
  return response.data.items
}

export async function createDiary(
  idToken: string,
  newDiary: CreateDiaryRequest,
  file: Buffer
) {
  console.log("create info ", newDiary)
  console.log("img ", file)
  const response = await Axios.post(`${apiEndpoint}/diaries`, JSON.stringify(newDiary), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  }).then(async (res) => {
    await uploadFile(res.data.url, file).then(async () => { return res.data.item })
  })

}

export async function patchDiary(
  idToken: string,
  diaryId: string,
  updatedDiary: UpdateDiaryRequest,
  file: Buffer
): Promise<void> {
  console.log("patchDiary info ", updatedDiary)
  console.log("diaryId info ", diaryId)
  await Axios.put(`${apiEndpoint}/diaries/${diaryId}`, JSON.stringify(updatedDiary), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  }).then(async (res) => {
    if (file != null) {
      await uploadFile(res.data.url, file)
    } else {
      alert("Action success")
    }
  })
}

export async function deleteDiary(
  idToken: string,
  diaryId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/diaries/${diaryId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

// export async function getUploadUrl(
//   idToken: string,
//   todoId: string
// ): Promise<string> {
//   const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${idToken}`
//     }
//   })
//   return response.data.uploadUrl
// }

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  console.log("uploadFile item", file)
  console.log("uploadFile url", uploadUrl)
  await Axios.put(uploadUrl, file).then(() => {
    alert("Action success")
  })
}
