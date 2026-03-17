import { faker } from '@faker-js/faker'

export const randomDateBetween = (start: Date, end: Date) =>
  faker.date.between({ from: start, to: end })

export const randomPastDays = (days: number) => faker.date.recent({ days })

export const randomEmail = () => faker.internet.email()

export const randomName = () => faker.person.fullName()

export const randomPhrase = () => faker.hacker.phrase().slice(0, 100)

export const pickRandom = <T>(arr: T[]): T => faker.helpers.arrayElement(arr)

export const pickMultiple = <T>(arr: T[], count: number): T[] =>
  faker.helpers.arrayElements(arr, count)

export const randomInt = (min: number, max: number) => faker.number.int({ min, max })

export const randomUrl = () => faker.internet.url()

export const randomBuzzPhrase = () => faker.company.buzzPhrase()

export const randomCompanyPhrase = () => faker.company.catchPhrase()

export const randomSentence = () => faker.lorem.sentence()

export const randomParagraph = () => faker.lorem.paragraph()
