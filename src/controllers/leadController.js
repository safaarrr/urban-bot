import Lead from "../models/Lead.js";

export async function createLead(data) {

    const lead = await Lead.create(data);

    return lead;

}

export async function getAllLeads() {

    return await Lead.find().sort({
        createdAt: -1
    });

}
