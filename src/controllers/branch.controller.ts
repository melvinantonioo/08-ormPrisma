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

//get name clauses contain / like 
async function GetBranchesName(req: Request, res: Response, next: NextFunction) {
    try {
        interface IFilter {
            name?: string
        };

        const { name } = req.query;

        const filter: IFilter = {};

        if (name) {
            filter.name = name as string;
        };

        const data = await prisma.branch.findMany({
            where: {
                name: filter.name,
            },
        });

        res.status(200).send({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error)
    }
}
//
async function Pagination(req: Request, res: Response, next: NextFunction) {
    try {
        //pagination mainin skip an play 
        interface IFilter {
            page: number;
            pageSize: number;
        };

        const { page, pageSize } = req.query;

        const filter: IFilter = {
            page: parseInt(page as string),
            pageSize: parseInt(page as string)
        };

        //Skip And Take 
        const data = await prisma.branch.findMany({
            skip: filter.page != 1 ? (filter.page - 1) * filter.pageSize : 0,
            take: filter.pageSize, //sampe sini untuk pagination 
            where: { // membuat kondisi untuk terpenuhi 
                AND: [
                    {
                        name: 'sby',
                    },
                    {
                        location: 'surabaya',
                    },
                ],
            },
        });

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

//updat branch
async function UpdatBranchById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { name, location } = req.body;
        const data = await prisma.branch.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                location,
            }
        })

        res.status(200).send({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error)
    }
}

async function DeleteBranch(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        await prisma.branch.delete({
            where: {
                id: parseInt(id),
            }
        });

        res.status(200).send({
            message: "Success",
        });
    } catch (error) {
        next(error)
    }
}

//untuk data relasi 
async function JoinBranch(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const data = await prisma.branch.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                Manager: true,
            },
        });

        res.status(200).send({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error)
    }
}

//ketika kita buat branch , maka manager akan terbuat : Transaction 
// untuk memproteksi multiple insert , agar data tidak rusak 
async function CreateBranchTransaction(req: Request, res: Response, next: NextFunction) {
    try {
        //syntax .create() -> insert di sql ({isinya field dari table yang kita buat di db})
        const { name, location, managerName } = req.body

        await prisma.$transaction(async (prisma) => {
            const findBranch = await prisma.branch.findFirst({
                where: {
                    name,
                }
            })

            if (findBranch) {
                throw new Error("Branch with that name already exist")
            }

            const data = await prisma.branch.create({
                data: {
                    name,
                    location,
                },
            });

            const manager = await prisma.manager.create({
                data: {
                    name: managerName,
                    branchId: data.id,
                }
            })

            res.status(200).send({
                message: "Success",
                data,
            })
        })


    } catch (error) {
        next(error)
    }
}

export {
    CreateBranch,
    GetBranches,
    GetBranchesByid,
    GetBranchesName,
    UpdatBranchById,
    DeleteBranch,
    CreateBranchTransaction,
    JoinBranch,
    Pagination
};