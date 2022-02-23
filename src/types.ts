export interface IBaseEmployeeAttributes {
  areasOfPracticeIds: string[];
  asyncNewEmployeeTaskRequired?: boolean;
  businessUnitId: string;
  companyId: string;
  deviceOS?: string;
  email: string;
  firstName: string;
  id: string;
  iosVoipToken?: string;
  jobTitle: string;
  lastName: string;
  areasOfSpecialisationIds?: string[];
  pushToken?: string;
  sitesOfCareIds: string[];
  productDisclaimerAgreedTimestamp?: string;
  shareUrl?: string;
}

export interface IDynamoDBEmployee extends IBaseEmployeeAttributes {
  PK: string;
  SK: string;
}
