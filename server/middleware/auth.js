// // //Middleware to protect routes
// // import User from "../models/User.js";
// // import jwt from "jsonwebtoken";

// // export const protectRoute=async(req,res,next)=>{
// //     try {
// //         const token=req.headers.token;
// //         const decoded=jwt.verify(token,process.env.JWT_SECRET)
// //         const user=await User.findById(decoded.userId).select("-password")
// //         if(!user) return res.json({success:false,message:"User not found"})
// //             req.user=user;
// //         next();
// //     } catch (error) {
// //         console.log(error.message);
        
// //         res.json({success:false,message:error.message})
        
// //     }
// // }


// import User from "../models/User.js";
// import jwt from "jsonwebtoken";

// export const protectRoute = async (req, res, next) => {
//   try {
//     const token = req.headers.token;
//     if (!token) {
//       return res.status(401).json({ success: false, message: "No token provided" });
//     }

//     // ✅ Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // ✅ Find user
//     const user = await User.findById(decoded.userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // ✅ Attach user to request
//     req.user = user;

//     next();
//   } catch (error) {
//     console.log("Auth error:", error.message);
//     res.status(401).json({ success: false, message: "Invalid or expired token" });
//   }
// };
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Auth Error:", err.message);
    res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
  }
};
