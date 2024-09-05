export enum ApplicationStatus {
    PENDING = "PENDING",                  // Application is awaiting review
    SUBMITTED = "SUBMITTED",              // Application has been submitted
    UPDATED = "UPDATED",                  // Application has been updated
    APPROVED_BY_RT = "APPROVED_BY_RT",  // Approved by SLO
    APPROVED_BY_MDD = "APPROVED_BY_MDD",// Approved by MLAE
    APPROVED_BY_DRPP = "APPROVED_BY_DRPP",// Approved by DLAE
    APPROVED_BY_CEO = "APPROVED_BY_CEO",  // Approved by CEO
    COMPLETED = "COMPLETED",              // Application process is complete
    REJECTED = "REJECTED",                // Application has been rejected
    ADDITIONAL_INFO_REQUIRED = "ADDITIONAL_INFO_REQUIRED", // More information is needed
    IN_REVIEW = "IN_REVIEW"               // Application is currently under review
}

export enum PaymentStatus {
    PAID = "PAID",                  // Application is awaiting review
    NOTPAID = "NOT_PAID",
    FAILED ="FAILED"             // COntrol number timed out         
}

export enum Role {
    CEO = "CEO",
    DRPP = "DRPP", // Director  Research Policy and Planning
    MDD = "MDD", // Manager Market Development
    SPO = "SPO", // Senior Planning officer
    SFA="SFA",
    SLO="SLO",
    USER="USER",
    ADMIN="ADMIN",
    REGISTRY ="REGISTRY"
  }