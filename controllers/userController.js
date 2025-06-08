const User = require('../models/userSchema');
const { errorHandler } = require('../utils/errorHandler');


exports.toggleWhishList = async (req, res, next) => {

    const userId = req.user.id;
    const productId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) return next(errorHandler(403, "user not exist"))

        const index = user.wishList.indexOf(productId);

        if (index > -1) {

            user.wishList.splice(index, 1);
            await user.save();
            const { password: pass, ...rest } = user._doc;
            return res.json({ success: true, message: "Removed from wishlist", response: rest });
        } else {

            user.wishList.push(productId);
            await user.save();
            const { password: pass, ...rest } = user._doc;
            return res.json({ success: true, message: "Added to wishlist", response: rest });
        }
    } catch (err) {
        next(err)
    }

}

