import express from "express"
import { authenticateAdmin } from "../auth/verifyAdminToken.js"

import {
    BlockUser,
    approveCertificate,
    HandleApprove,
    getAllDoctor,
    getAllUser,
    login,
    HandleBlock,
    

} from "../Controllers/AdminController.js"

const router=express.Router()

router.post('/login',login)
router.get('/getAllUser',getAllUser)
router.post('/BlockUser/:id',BlockUser)
// router.post('/UnblockUser/:id',UnblockUser)

router.get('/getAllDoctor',getAllDoctor)
router.post('/approveCertificate/:id',approveCertificate)
router.put('/HandleApprove/:id',HandleApprove)
router.put('/HandleBlock/:id',HandleBlock)

export default router