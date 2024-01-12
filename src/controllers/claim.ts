import { Response, NextFunction } from 'express';

import { TypedRequestBody, TypedRequestQuery } from 'types/routes';
import { Claim, ClaimStatus, ClaimSearchQuery, ClaimSearchFilter } from 'types/insurance';
import { UserRole } from 'types/user';
import { SearchOptions } from 'types/search';
import claimModel from 'models/claim';
import { validateClaimFunction } from 'validation/claim';
import AppError, { handleParamMissingError } from 'utils/appError';
import { defaultLimit, defaultPage } from 'utils/constants';
import { addZeros, generateRandomCapitalLetter, getSearchOptionValue } from 'utils/helpers';
import { isValidBetweenDates } from 'utils/date';
import allowedToCreateClaim from 'helpers/allowedToCreateClaim';

const getSerial = (claimNumber: string, separator: string): string =>
  claimNumber.split(new RegExp(`^.{10}${separator}`))[1];

const generateClaimNumber = async (startDate: string, employerCode?: string) => {
  const randomLetter = generateRandomCapitalLetter();
  const filter: ClaimSearchFilter = {
    number: new RegExp(`^${employerCode}{2}|^.{10}${randomLetter}`, 'i')
  };

  const lastClaim = await claimModel.getClaimByFilterAndSort(filter, 'number', -1);
  const lastClaimNumber = lastClaim ? lastClaim.number : null;
  const serial = lastClaimNumber && getSerial(lastClaimNumber, randomLetter);

  const startDateWithoutTime = startDate.split('T')[0].replace(/-/g, '');
  const beginningOfNumber = `${employerCode}${startDateWithoutTime}`;

  let newClaimNumber;
  if (serial) {
    newClaimNumber = `${beginningOfNumber}${randomLetter}${addZeros(parseInt(serial, 10) + 1, 5)}`;
  } else {
    newClaimNumber = `${beginningOfNumber}${randomLetter}${addZeros(1, 5)}`;
  }

  return newClaimNumber;
};

const createClaim = async (req: TypedRequestBody<Claim>, res: Response, next: NextFunction) => {
  try {
    const isValid = validateClaimFunction(req.body);
    if (!isValid) {
      throw new AppError({ statusCode: 400, ajvError: validateClaimFunction.errors });
    }

    const hasClaimCreateRight = await allowedToCreateClaim(req);
    if (!hasClaimCreateRight) {
      throw new AppError({ statusCode: 403, message: 'This possibility was prevented' });
    }

    const { startDate: planStartDate, endDate: planEndDate } = res.locals.plan;
    const claimStartDate = req.body.startDate;

    if (!isValidBetweenDates(claimStartDate, planStartDate, planEndDate)) {
      throw new AppError({
        statusCode: 400,
        message: 'Claim date should be within the boundary of plan year.'
      });
    }

    const claim = await claimModel.createClaim({
      ...req.body,
      consumerID: res.locals.user.id,
      number: await generateClaimNumber(
        req.body.startDate,
        res.locals.user?.employer?.code.toUpperCase()
      )
    });

    res.status(201).json(claim);
  } catch (err) {
    next(err);
  }
};

const getClaim = async (req: TypedRequestBody<Claim>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) handleParamMissingError('id');

    const claim = await claimModel.getClaim(id);

    if (!claim) {
      throw new AppError({ statusCode: 404, message: 'No claim found with that ID.' });
    }

    res.status(200).json(claim);
  } catch (err) {
    next(err);
  }
};

const updateClaim = async (req: TypedRequestBody<Claim>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) handleParamMissingError('id');

    const isValid = validateClaimFunction(req.body);
    if (!isValid) {
      throw new AppError({ statusCode: 400, ajvError: validateClaimFunction.errors });
    }

    const filter: ClaimSearchFilter = {
      id: req.params.id,
      status: new RegExp(`${ClaimStatus.approved}|${ClaimStatus.denied}`, 'i')
    };
    const claimNotPending = await claimModel.getClaimByFilterAndSort(filter, 'id', 1);
    if (claimNotPending) {
      throw new AppError({
        statusCode: 400,
        message: "Only a claim with status 'pending' can be updated."
      });
    }

    const claim = await claimModel.updateClaim(req.body, id);

    if (!claim) {
      throw new AppError({ statusCode: 404, message: 'No claim found with that ID.' });
    }

    res.status(200).json(claim);
  } catch (err) {
    next(err);
  }
};

const getClaims = async (
  req: TypedRequestQuery<ClaimSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { number, employer, status, page = defaultPage, limit = defaultLimit } = req.query;
    const {
      user: { role, id }
    } = req.ctx;
    let filter: ClaimSearchFilter = {};

    if (number) {
      filter.number = new RegExp(`${number}`, 'i');
    }
    if (employer) {
      filter['employer.name'] = new RegExp(`${employer}`, 'i');
    }
    if (status) {
      filter.status = new RegExp(`${status}`, 'i');
    }

    if (role === UserRole.consumer) {
      filter = { 'consumer.id': id };
    }

    const options: SearchOptions = {
      page: getSearchOptionValue(defaultPage, page),
      limit: getSearchOptionValue(defaultLimit, limit),
      sortBy: 'number'
    };

    const result = await claimModel.getClaimsByFilter(filter, options);
    res.send(result);
  } catch (err) {
    next(err);
  }
};

export default { createClaim, getClaim, getClaims, updateClaim };
