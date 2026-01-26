const Specialization = require("../model/specialization-model");

const createSpecialization = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Name required!" });

    const exists = await Specialization.findOne({ name });
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "Already Exists!" });

    const specialization = await Specialization.create({
      name,
      description,
      isActive: true,
    });
    res.status(201).json({
      success: true,
      message: "Specialization Created",
      specialization,
    });
  } catch (error) {
    console.error("Create Specialization Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateSpecialization = async (req, res) => {
  try {
    const { id } = req.params;
    const specialization = await Specialization.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!specialization)
      return res.status(404).json({ success: false, message: "Not Found!" });

    res.status(200).json({ success: true, message: "Updated", specialization });
  } catch (error) {
    console.error("Update Specialization Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const toggleSpecializationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const specialization = await Specialization.findById(id);
    if (!specialization)
      return res.status(404).json({ success: false, message: "Not Found!" });

    specialization.isActive = !specialization.isActive;
    await specialization.save();

    res.status(200).json({
      success: true,
      message: "Status Updated",
      isActive: specialization.isActive,
    });
  } catch (error) {
    console.error("Toggle Specialization Status Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json({ success: true, count: specializations.length, specializations });
  } catch (error) {
    console.error("Fetch Specializations Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  createSpecialization,
  updateSpecialization,
  toggleSpecializationStatus,
  getAllSpecializations,
};
