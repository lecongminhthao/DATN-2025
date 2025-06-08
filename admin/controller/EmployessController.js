const Employee = require("../model/EmployessModel");
const bcrypt = require("bcryptjs");
const moment = require("moment");

const isPhoneValid = (phone) => {
  const phoneRegex = /^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})$/;
  return phoneRegex.test(phone);
};

const isEmailValid = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};

const isDobValid = (dob) => {
  const today = moment().format("YYYY-MM-DD");
  return moment(dob).isBefore(today);
};

const generateEmployeeId = async () => {
  const lastEmployee = await Employee.findOne().sort({ employeeId: -1 });
  if (!lastEmployee) {
    return "nv01";
  }

  const lastEmployeeId = lastEmployee.employeeId;
  const lastNumber = parseInt(lastEmployeeId.substring(2));
  const newNumber = lastNumber + 1;

  const newEmployeeId = "nv" + newNumber.toString().padStart(2, "0");
  return newEmployeeId;
};

const isFieldExist = async (field, value) => {
  const exists = await Employee.findOne({ [field]: value });
  return exists !== null;
};

exports.createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      dob,
      role,
      username,
      password,
      status,
    } = req.body;

    const errors = {};

    if (!firstName) errors.firstName = "Họ tên là bắt buộc";
    if (!lastName) errors.lastName = "Tên là bắt buộc";
    if (!phone) errors.phone = "Số điện thoại là bắt buộc";
    if (!email) errors.email = "Email là bắt buộc";
    if (!dob) errors.dob = "Ngày sinh là bắt buộc";
    if (!role) errors.role = "Vai trò là bắt buộc";
    if (!username) errors.username = "Tên đăng nhập là bắt buộc";
    if (!password) errors.password = "Mật khẩu là bắt buộc";
    if (!status) errors.status = "Trạng thái là bắt buộc";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    if (username.length <= 5) {
      errors.username = "Tên đăng nhập phải dài hơn 5 ký tự";
    }

    if (!isPhoneValid(phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (!isEmailValid(email)) {
      errors.email = "Định dạng email không hợp lệ";
    }

    if (!isDobValid(dob)) {
      errors.dob = "Ngày sinh không được ở trong tương lai";
    }

    const emailExist = await isFieldExist("email", email);
    if (emailExist) {
      errors.email = "Email này đã tồn tại";
    }

    const phoneExist = await isFieldExist("phone", phone);
    if (phoneExist) {
      errors.phone = "Số điện thoại này đã tồn tại";
    }

    const usernameExist = await isFieldExist("username", username);
    if (usernameExist) {
      errors.username = "Tên đăng nhập này đã tồn tại";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const employeeId = await generateEmployeeId();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      employeeId,
      firstName,
      lastName,
      phone,
      email,
      dob,
      role,
      username,
      password: hashedPassword,
      status,
    });

    await newEmployee.save();

    res.status(201).json({ message: "Tạo nhân viên thành công" });
  } catch (err) {
    console.error("Lỗi khi tạo nhân viên:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi tạo nhân viên", error: err.message });
  }
};

// Lấy danh sách nhân viên có phân trang
exports.getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const employees = await Employee.find().skip(skip).limit(limit);

    const totalEmployees = await Employee.countDocuments();
    const totalPages = Math.ceil(totalEmployees / limit);

    res.status(200).json({
      message: "Danh sách nhân viên đã được lấy thành công",
      employees,
      totalEmployees,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách nhân viên:", err);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách nhân viên",
      error: err.message,
    });
  }
};

// Cập nhật nhân viên
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedEmployee)
      return res.status(404).json({ message: "Nhân viên không tồn tại" });

    res
      .status(200)
      .json({ message: "Cập nhật nhân viên thành công", updatedEmployee });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật nhân viên", error: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee)
      return res.status(404).json({ message: "Nhân viên không tồn tại" });

    res.status(200).json({ message: "Xóa nhân viên thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa nhân viên", error: err.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Nhân viên không tồn tại" });
    }

    res.status(200).json({ employee });
  } catch (err) {
    console.error("Lỗi khi lấy thông tin nhân viên:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy thông tin nhân viên", error: err.message });
  }
};
