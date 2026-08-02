const leads = [];

export function addLead(lead) {
    leads.push({
        id: Date.now(),
        ...lead,
        createdAt: new Date()
    });
}

export function getLeads() {
    return leads;
}
