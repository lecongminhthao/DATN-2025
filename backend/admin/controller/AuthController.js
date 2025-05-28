const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../model/EmployessModel");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const employee = await Employee.findOne({ username });
    if (!employee) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      console.log("tài khoản mật khẩu không đúng");
      return res.status(400).json({ message: "sai rồi khổ quá" });
    }

    const token = jwt.sign(
      {
        id: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        role: employee.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "đăng nhập thành công",
      token,
      employee: {
        id: employee.employeeId,
        username: employee.username,
        firstName: employee.firstName,
        lastName: employee.lastName,
        role: employee.role,
      },
    });
  } catch (error) {
    console.error("đăng nhập thất bại:", error);
    res.status(500).json({ message: "không được khổ quá" });
  }
};
