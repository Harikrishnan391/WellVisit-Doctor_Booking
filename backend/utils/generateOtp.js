import crypto from 'crypto'

const generateOTP=()=>{

    return (crypto.randomBytes(2).readUInt16BE()%10000).toString().padStart(4,'0')
}

export default generateOTP