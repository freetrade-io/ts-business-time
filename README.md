# TypeScript Business Time (Market Hours)

"Business time" logic in TypeScript (aka "business hours", "working days" etc).
This can be useful for calculating shipping dates or market hours, for example.

This extension lets you handle business time precisely and flexibly. It can
consider public holidays from WebCal.fi, as well as your own customised times
which can be specified directly or with constraint-matching.

[Official music video for this library](https://www.youtube.com/watch?v=WGOohBytKTU)

## Contents

  * [Installation](#installation)
  * [Usage](#usage)
    + [Business days](#business-days)
      - [Adding or subtracting business days](#adding-or-subtracting-business-days)
      - [Diff in business days](#diff-in-business-days)
      - [Whole vs partial business days](#whole-vs-partial-business-days)
      - [Length of a business day](#length-of-a-business-day)
    + [Business hours](#business-hours)
  * [Describing business times](#describing-business-times)
  * [Start and end of business day](#start-and-end-of-business-day)
  * [Determining business time](#determining-business-time)
    + [Business time constraints](#business-time-constraints)
      - [Inversion of business time constraints](#inversion-of-business-time-constraints)
      - [Exceptions to business time constraints](#exceptions-to-business-time-constraints)
      - [Custom business time constraints](#custom-business-time-constraints)
      - [Business time constraints example](#business-time-constraints-example)
  * [Incorporating business time data from a remote source](#incorporating-business-time-data-from-a-remote-source)
    + [WebCal.fi](#webcalfi)
    + [Custom remote sources](#custom-remote-sources)
  * [Recurring business deadlines](#recurring-business-deadlines)
  * [Business time factory](#business-time-factory)
  * [Precision](#precision)
  * [Testing](#testing)

## Installation

Install via NPM:

```bash
npm i ts-business-time
```

Or via Yarn:

```bash
yarn add ts-business-time
```

## Usage

Import BusinessTime into a module like this:

```typescript
import BusinessTime from 'ts-business-time'
```

### Business days

You'll probably be dealing with business days most often.

#### Adding or subtracting business days

You can add or subtract business days from a given starting date:

```typescript
const friday = new BusinessTime('Friday');
const nextBusinessDay = friday.addBusinessDay()
// = Monday
const threeBusinessDays = friday.addBusinessDays(3);
// = Wednesday
```
