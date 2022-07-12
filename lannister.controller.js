const LannisterUser = require("./lannister.model");
const uuid = require("uuid");
// console.log(uuid)
// console.log(LannisterUser);

const share = async (req, res, next) => {
  try {
    const { amount, customerEmail, splitInfo, splitType, splitValue } =
      req.body;

    const flatArray = [];
    const percentageArray = [];
    const ratioArray = [];
    let availableBalance = amount;
    splitInfo.forEach((info) => {
      if (info.splitType == "FLAT") {
        flatArray.push(info);
      } else if (info.splitType == "PERCENTAGE") {
        percentageArray.push(info);
      } else if (info.splitType == "RATIO") {
        ratioArray.push(info);
      }
    });

    flatArray.forEach((flat) => {
      flatAmount = flat.splitValue;
      availableBalance = availableBalance - flat.splitValue;
      console.log(flatAmount);
    });

    percentageArray.forEach((percentage) => {
      percentageAmount = (percentage.splitValue / 100) * availableBalance;
      availableBalance = availableBalance - percentageAmount;
      // console.log(percentageAmount);
    });
    let ratioSum = 0;
    let ratioBalance = availableBalance;
    ratioArray.forEach((ratio) => {
      ratioSum = ratioSum + ratio.splitValue;
      // availableBalance = availableBalance - ratioAmount;
    });
    ratioArray.forEach((ratio) => {
      // ratioSum = ratioSum + ratio.splitValue;
      ratioAmount = (ratio.splitValue / ratioSum) * ratioBalance;
      availableBalance = availableBalance - ratioAmount;
      // console.log(ratioAmount);
    });

    console.log(ratioSum);
    console.log("This is available Balance", availableBalance);
    const newShare = new LannisterUser({
      amount,
      customerEmail,
      splitInfo,
      // : [
      //   {
      //     splitType: splitInfo[0].splitType,
      //     splitValue: splitInfo[0].splitValue,
      //     splitEntityId: uuid.v4(),
      //   },
      // ],
    });
    await newShare.save();
    console.log(ratioArray);
    // console.log(percentageArray);
    // console.log(ratioArray);
    return res.status(200).json({
      newShare,
      flatArray: flatArray,
      percentageArray: percentageArray,
      ratioArray: ratioArray,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

module.exports = { share };
