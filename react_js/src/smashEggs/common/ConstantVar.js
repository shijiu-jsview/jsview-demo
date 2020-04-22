/**
 * Created by luocf on 2020/3/19.
 */

let ConstantVar = {}
ConstantVar.BranchName = {
    "GetDiscountBtn":"GetDiscountBtn",
    "EnterStudyingBtn":"EnterStudyingBtn",
    "MyPrizeRecordBtn": "MyPrizeRecordBtn",
    "SmashEggsPage":"SmashEggsPage",
    "MyPrizeRecordPage":"MyPrizeRecordPage",
    "NoPrizePage":"NoPrizePage",
    "GetPrizePage":"GetPrizePage",
    "GetPrizeFinishPage":"GetPrizeFinishPage",
}
ConstantVar.KeyCode = {
    Left:37,
    Up:38,
    Right:39,
    Down:40,
    Ok:13,
    Menu:82,
    Back:27,
    Back2:10000,
}
ConstantVar.Prize = [
    {'id':1,'prize': '京东购物卡1000元'},
    {'id':2,'prize': '迪士尼美国队长书包'},
    {'id':3,'prize': '迪士尼保温杯男女生'},
    {'id':4,'prize': '迪士尼小学生文具7件套'},
    {'id':5,'prize': '很遗憾,你没有中奖'},
]

ConstantVar.NoPrize = 5;

export default ConstantVar;
