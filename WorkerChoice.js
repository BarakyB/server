const router = require("express").Router();
const connection = require ('./dbConfig')
const Query = require("./dbConfig");


router.post("/", async(req, res) =>{
    const {userid, workerId,roleId,  date, time} = req.body;
    //idusers, idrole, idworks, startdate, rangetime
    const sqlInsert = `insert into worktask (idusers, idrole, idworks, startdate, rangetime) 
        values (${idusers},${idrole},${idworks},'${startdate}',${rangetime}})`
    const response = await Query(sqlInsert);
    return res
        .status(201)
        .json({response });
})
router.get("/:workerid", async (req, res) => {
    const workingHours = [8,9,10,11,12,13,14,15,16,17];
    const {workerid} = req.params;
    const {date} = req.query;
    //console.log(workerid, date);
    const select_query = `SELECT rangeTime FROM queueb4u.worktask where idworks = ${workerid} and startdate = '${date}'`;
    const hours = await Query(select_query);
    for(let i = 0; i < workingHours.length; i++){
        const index =  hours.findIndex(h => h.rangeTime ==workingHours[i] );
        if(index > -1){
            workingHours.splice(i, 1);
        }
    }
    //console.log(workingHours)
    return res
        .status(200)
        .json({workingHours });

});



module.exports = router;
