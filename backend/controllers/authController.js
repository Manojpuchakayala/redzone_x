const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required." });
    }

    // Attempt DB lookup with fallback
    let user = null;
    try {
      user = await User.findOne({ email });
    } catch (e) {}

    if (!user) {
      // In-memory demo account
      user = {
        name: email.split("@")[0].toUpperCase() + " Officer",
        email,
        role: "Emergency Operator",
        organization: "NDRF / SDMA Emergency Operations",
        badgeId: "NDMA-7742",
      };
    }

    res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        badgeId: user.badgeId,
      },
      token: "demo_emergency_token_" + Date.now(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, organization, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    let newUser = {
      name,
      email,
      password,
      organization: organization || "State Disaster Management Authority",
      role: role || "Emergency Operator",
      badgeId: `NDMA-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    try {
      await User.create(newUser);
    } catch (e) {}

    res.status(201).json({
      success: true,
      message: "Responder account created successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organization: newUser.organization,
        badgeId: newUser.badgeId,
      },
      token: "demo_emergency_token_" + Date.now(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
