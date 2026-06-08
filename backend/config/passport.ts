import passport from 'passport'
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20"
import { Strategy as FacebookStrategy } from "passport-facebook"
import { facebookLogin, googleLogin } from '../controller/socialAuth.controller'

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: "http://localhost:5000/api/social/google/callback"
},
async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
        const data = await googleLogin(profile)
        done(null, data)
    } catch (error: any) {
        done(error, undefined)
    }
}
))

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || "",
    clientSecret: process.env.FACEBOOK_APP_SECRETE || "",
    callbackURL: "http://localhost:5000/api/social/facebook/callback",
    profileFields: ["id", "displayName", "photos", "email"]
},
async(accessToken:string,refreshToken:string,profile:any,done:any)=>{
    try {
        const data = await facebookLogin(profile)
        done(null,data)
    } catch (error:any) {
        done(error,undefined)
    }
}
))