const Color = require("../model/ColorModel");

const generateNewColorCode = async () => {
  const latestColor = await Color.findOne().sort({ createdAt: -1 });

  if (!latestColor || !latestColor.code) return "M001";

  const currentNumber = parseInt(latestColor.code.slice(1)) || 0;
  const newNumber = currentNumber + 1;
  return `M${String(newNumber).padStart(3, "0")}`;
};

exports.getAllColors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const colors = await Color.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Color.countDocuments();

    res.json({
      data: colors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createColor = async (req, res) => {
  try {
    const { name, status } = req.body;
    const code = await generateNewColorCode();

    const newColor = await Color.create({ code, name, status });
    res.status(201).json(newColor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateColor = async (req, res) => {
  try {
    const updated = await Color.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteColor = async (req, res) => {
  try {
    await Color.findByIdAndDelete(req.params.id);
    res.json({ message: "Color deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getColorById = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ error: "Color not found" });
    }
    res.json(color);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getColorsByStatus = async (req, res) => {
  try {
    const status = parseInt(req.params.status);

    if (isNaN(status)) {
      return res.status(400).json({ error: "Status phải là số (0 hoặc 1)" });
    }

    const colors = await Color.find({ status }).sort({ createdAt: -1 });

    res.json(colors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
