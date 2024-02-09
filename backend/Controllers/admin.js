
export const login = async (req, res) => {
  let token;
  try {
    const { email, password, type } = req.body;
    console.log(type);

    const userModel = type === "patient" ? User : Doctor;

    const user = await userModel.findOne({ email: email });
    if (!user) {
      res.status(404).json({ message: "Invalid user" });
    } else {
      if (user.isBlocked) {
        res.status(401).json({ message: "User is blocked" });
      } else {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log(isPasswordMatch);
        if (!isPasswordMatch) {
          res.status(400).json({ message: "Invalid email or password" });
        } else {
          if (type === "doctor" && !user.isApproved) {
            res.status(401).json({ message: "Doctor approval pending" });
          } else {
            if (type === "patient") {
              token = generatePatientToken(user._id, res);
            } else if (type === "doctor") {
              console.log("user._id", user._id);

              token = generateDoctorToken(user._id, res);
            }
            const { password, appointments, ...rest } = user._doc;
            res.status(200).json({
              status: true,
              message: "Login Successful!!",
              token,
              data: { ...rest, token: token },
              type,
            });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Failed to login!" });
  }
};
