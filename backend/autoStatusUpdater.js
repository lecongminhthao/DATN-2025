const ProductDetail = require("./model/ProductDetailModel");
const PromotionProgram = require("./model/PromotionProgram");
const ProductPromotion = require("./model/ProductPromotion"); // chỉnh path tùy theo dự án

const autoUpdateProductStatus = async () => {
  try {
    const productsToUpdate = await ProductDetail.find({
      quantity: 0,
      status: { $ne: 2 },
    });

    if (productsToUpdate.length > 0) {
      const updatePromises = productsToUpdate.map((product) =>
        ProductDetail.findByIdAndUpdate(product._id, { status: 2 })
      );
      await Promise.all(updatePromises);
      console.log(
        `[AutoStatus] ✅ Cập nhật ${productsToUpdate.length} sản phẩm về status = 2`
      );
    } else {
      console.log("[AutoStatus] ⏳ Không có sản phẩm nào cần cập nhật");
    }
  } catch (err) {
    console.error("[AutoStatus] ❌ Lỗi khi cập nhật sản phẩm:", err.message);
  }
};

const autoUpdatePromotionStatus = async () => {
  try {
    const today = new Date();

    // Chỉ tìm các chương trình khuyến mãi đang ở trạng thái 'pending'
    const pendingPromotions = await PromotionProgram.find({
      status: "pending",
    });

    await Promise.all(
      pendingPromotions.map(async (promotion) => {
        const { startDate, endDate, status } = promotion;

        // Nếu hôm nay nằm trong khoảng startDate đến endDate => chuyển sang 'active'
        if (startDate <= today && today <= endDate) {
          promotion.status = "active";
          await promotion.save();

          // Cập nhật status các ProductPromotion liên quan thành true
          await ProductPromotion.updateMany(
            { promotionProgram: promotion._id },
            { $set: { status: true } }
          );

          console.log(
            `✅ Đã chuyển khuyến mãi ${promotion._id} sang trạng thái 'active' và cập nhật ProductPromotion`
          );
        }
      })
    );

    console.log("🟢 Đã kiểm tra và cập nhật các khuyến mãi  hợp lệ");
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật khuyến mãi:", err.message);
  }
};

const startAutoTasks = () => {
  autoUpdateProductStatus();
  autoUpdatePromotionStatus();

  setInterval(() => {
    autoUpdateProductStatus();
    autoUpdatePromotionStatus();
  }, 60 * 1000); // 1 phút (nên dùng thay vì 1 giây)
};

module.exports = startAutoTasks;
