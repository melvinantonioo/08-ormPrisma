import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

//penggunaan prisma bedanya di controller ini 
//ganti db query sql , dgn syntax orm  prisma.tableName.create/.findMany/.findunique();
const prisma = new PrismaClient();

async function CreateBranch(req: Request, res: Response, next: NextFunction) {
    try {
        //syntax .create() -> insert di sql ({isinya field dari table yang kita buat di db})
        const { name, location } = req.body

        const data = await prisma.branch.create({
            data: {
                name,
                location,
            },
        });

        res.status(200).send({
            message: "Success",
            data,
        })

    } catch (error) {
        next(error)
    }
}
//get all data
async function GetBranches(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await prisma.branch.findMany();

        res.status(200).send({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error)
    }
}

async function GetBranchesByid(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const data = await prisma.branch.findUnique({
            where: {
                id: parseInt(id),
            }
        });

        res.status(200).send({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error)
    }
}

export { CreateBranch, GetBranches, GetBranchesByid };