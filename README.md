# TypeScript Business Time (Market Hours)

[![Build Status](https://travis-ci.org/freetrade-io/ts-business-time.svg?branch=master)](https://travis-ci.org/freetrade-io/ts-business-time)
[![npm version](https://badge.fury.io/js/ts-business-time.svg)](http://badge.fury.io/js/ts-business-time)

"Business time" logic in TypeScript (aka "market hours", "business hours",
"working days" etc). This can be useful for calculating shipping dates or market
open and close times, for example.

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
  * [Recurring business deadlines](#recurring-business-deadlines)
  * [Business time factory](#business-time-factory)
  * [Precision](#precision)

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
const friday = new BusinessTime(moment.utc("2019-02-22T13:50:18.475Z"));
const nextBusinessDay = friday.addBusinessDay()
// = instance for the following Monday
const threeBusinessDays = friday.addBusinessDays(3);
// = instance for the following Wednesday
```

```typescript
const monday = new BusinessTime(moment.utc("2019-02-18T13:50:18.475Z"));
const previousBusinessDay = monday.subtractBusinessDay()
// = instance for the previous Friday
const threeBusinessDays = monday.subtractBusinessDays(3);
// = instance for the previous Wednesday
```

#### Diff in business days

Besides adding or subtracting business days, you can also calculate the number
of business days between two given dates.

```typescript
const now = new BusinessTime()
const nextWeek = moment.utc().add(1, "week") // a full 7-day week.
const diff: number = now.diffInBusinessDays(nextWeek)
// = 5
```

#### Whole vs partial business days

The examples above deal with *whole* business days. You could also describe this
as *integer days*. This means that any fractional part of a day is not
considered to be a business day and is not counted.

For example, if we ask how many business days there are between 10am Friday and
10am Saturday, the answer is zero:

```typescript
const fridayTenAm = new BusinessTime(moment.utc("2019-02-22T10:00:00.000Z"))
fridayTenAm.diffInBusinessDays(moment.utc("2019-02-23T10:00:00.000Z"))
// = 0
```

This may be surprising if you were expecting the business hours on Friday to be
included. The reason the result is zero is because no *whole* business day has
passed in that time; even most of a business day is not enough to be counted.

If you do want to consider partial days, you can use the equivalent partial
methods to get a float value.

```typescript
const fridayTenAm = new BusinessTime(moment.utc("2019-02-22T10:00:00.000Z"))
fridayTenAm.diffInPartialBusinessDays(moment.utc("2019-02-23T10:00:00.000Z"))
// = 0.875
```

These are kept separate because usually people do not want to deal with the
concept of fractional business time: either a business day has passed or it has
not. The `partial` methods let you access the floating point number when you
want to.

#### Length of a business day

To calculate a partial business day, we need to know the total length of time of
a business day. For example, 09:00 to 17:00 could be 100% of a business day if
those are the business hours, but only 80% of a business day if the hours are
09:00 to 19:00.

Out of the box, BusinessTime treats a business day as being 8 hours long (09:00
to 17:00). You can adjust this to suit your needs, though.

The simplest way to configure this is to directly set the length of a business
day:

```typescript
const businessTime = new BusinessTime()
businessTime.setLengthOfBusinessDay(moment.duration(6, "hours"))
```

If you have complicated business time constraints (see below), it might be
helpful to let BusinessTime calculate the length of a business day for you. You
can do that by passing in a `DateTime` representing your standard business day
to the `determineLengthOfBusinessDay()` method. BusinessTime will then calculate
the length of the business day based on that using its constraints.

```typescript
const businessTime = new BusinessTime()
businessTime.determineLengthOfBusinessDay(moment.utc("2019-02-18T13:50:18.475Z"))
```

### Business hours

You can also make business time calculations in hours:

```typescript
const now = new BusinessTime()
const afterABusinessHour = now.addBusinessHour()
const afterThreeBusinessHours = now.addBusinessHours(3)
```

```typescript
const now = new BusinessTime()
const wholeBusinessHours = now.diffInBusinessHours()
const partialBusinessHours = now.diffInPartialBusinessHours()
```

The reason a day is the largest unit included out-of-the-box is because people
and organisations have different understandings of what is meant by larger units
of time. Not having built-in methods for those prevents assumptions being made
and forces explicitness, e.g. with `now.addBusinessDays(30)`.

Similarly, no unit smaller than an hour is included out-of-the-box because the
concept of a "business minute" is questionable for most use cases. You can
calculate minutes by multiplying by 60 if you do need them. Note that because
the default precision is one hour, you may need to adjust the precision to e.g
15 minutes to get accurate calculations (see the note on precision and
performance).

## Describing business times

In some situations it's useful to have meaningful descriptions for business and
non-business times. For example, you might want to tell your customer that you
won't fulfil their order until next week because the weekend is in between.

You can use the `BusinessTimePeriod` class for this. You can make an instance
with start and end times like this:

```typescript
const start = moment.utc("2019-02-18T13:50:18.475Z")
const end = moment.utc("2019-02-22T13:50:18.475Z")
const timePeriod = BusinessTimePeriod.fromMoments(start, end)
```

You can then use the `businessDays()` and `nonBusinessDays()` methods on the
time period to get that information. For example:

```typescript
const businessDays: BusinessTime[] = timePeriod.businessDays()
const nonBusinessDays: BusinessTime[] = timePeriod.nonBusinessDays()
```

This returns an array of `BusinessTime` objects for each relevant day, which
can tell you their name:

```typescript
nonBusinessDays[0].businessName()
// = e.g. "the weekend"
```

What intervals and descriptions you get depends on which business time
constraints have been used.

You can also ask a `BusinessTimePeriod` for its business and non-business sub-
periods, for example:

```typescript
const start = moment.utc("2019-02-18T13:50:18.475Z")
const end = moment.utc("2019-02-22T13:50:18.475Z")
const timePeriod = BusinessTimePeriod.fromMoments(start, end)

const businessPeriods: BusinessTimePeriod[] = timePeriod.businessPeriods()
// = array of BusinessTimePeriod instances for each period of business time.
const nonBusinessTimePeriods: BusinessTimePeriod[] = timePeriod.nonBusinessTimePeriods()
// = array of BusinessTimePeriod instances for each period of non-business time.
```

This lets you see the business timings that make up the whole time period. You
can ask each sub-period for its business-relevant name with the `businessName()`
method.

## Start and end of business day

You can get the start or end of the business day based on the business time
constraints like this:

```typescript
const businessTime = new BusinessTime()
businessTime.startOfBusinessDay()
// = BusinessTime instance for e.g. 09:00 that day
businessTime.endOfBusinessDay()
// = BusinessTime instance for e.g. 17:00 that day
```

## Determining business time

By default, this library considers Monday to Friday, 9am to 5pm to be business
time. You can configure this to suit your needs, though.

### Business time constraints

You can set the constraints to determine business time on the `BusinessTime`
class like this (note that the business time instance is immutable, so the 
method returns a new instance):

```typescript
let businessTime = new BusinessTime()
businessTime = businessTime.withConstraints(
    new WeekDays(),
    new BetweenHoursOfDay("09", "17")
)
```

You can pass as many constraints as you need; *all* of the constraints must be
satisfied for a given time to be considered business time.

The following constraints are available out-of-the-box, some of which can be
customised via their constructors:

```typescript
new HoursOfDay("08", "10", "13", "17");
new BetweenHoursOfDay("09", "17");
new BetweenTimesOfDay('08:45', '17:30');
new WeekDays();
new Weekends();
new DaysOfWeek("Monday", "Wednesday", "Friday");
new BetweenDaysOfWeek("Monday", "Friday");
new DaysOfMonth("1st", "8th", "23rd");
new BetweenDaysOfMonth("1st", "20th");
new MonthsOfYear("January", "March", "July");
new BetweenMonthsOfYear("January", "November");
new DaysOfYear("January 8th", "March 16th", "July 4th");
new BetweenDaysOfYear("January 1st", "December 5th");
new Dates("2019-01-17", "2019-09-23", "2020-05-11");
new BetweenDates("2018-01-11", "2018-12-31");
new AnyTime(); // Oh dear.
```

#### Inversion of business time constraints

You can wrap any business time constraint in a `NotConstraint` to invert it.

For example:

```typescript
const decemberOff = new NotConstraint(new MonthsOfYear("December"))
```

This constraint now matches any time that is *not* in the month of December. You
can pass as many other constraints as you need into the `NotConstraint`
constructor.

#### Exceptions to business time constraints

The constraints above have an `exceptFor()` method that takes one or more other
constraints. This creates a composite constraint that lets you add exceptions to
your business time rules.

For example:

```typescript
const lunchTimeOff = new BetweenHoursOfDay("09", "17").exceptFor(
    new HoursOfDay("13")
)
```

That constraint now matches any time between 9am and 5pm *except* for the hour
between 1pm and 2pm. You can pass as many exceptional constraints as you need
into the `except()` method.

*Note*: You can use the `exceptFor()` method on the `AnyTime` constraint as an
alternative way to define your constraints:

```typescript
new AnyTime().exceptFor(new DaysOfWeek("Friday"))
// All times except Fridays are considered business time.
```

If `exceptFor()` is not enough for your needs, you can also use the `andAlso()`
and `orAlternatively()` methods to build different types of composite
constraints based on NOT, AND and OR logic respectively.

#### Custom business time constraints

You can implement your own custom constraints by implementing the
`IBusinessTimeConstraint` interface:

```
interface IBusinessTimeConstraint {
    isBusinessTime(time: moment.Moment): boolean
}
```

The constraint must take an instance of `moment.Moment` and return whether or
not it should be considered business time.

This would be a good way to pull in configurable constraints from a database or
a remote source.

If you want to enable combinatorial logic for your custom constraint, extend the
`CombinatorialConstraint` abstract class, or implement the
`ICombinatorialConstraint` interface directly.

*Tip*: It's usually better to use multiple simple constraints together than to
make one big, complex one.

#### Business time constraints example

Here's a somewhat complicated example of using business time constraints:

```typescript
const businessTime = new BusinessTime().withConstraints(
    new BetweenHoursOfDay("10", "18").exceptFor(
        new BetweenTimesOfDay("13:00", "14:00")
    ), // 9-6 every day, with an hour for lunch.
    new WeekDays().exceptFor(
        new WeekDays("Thursday")
    ), // Week days, but let's take Thursdays off.
    new BetweenMonthsOfYear("January", "November"), // Take December off too.
    new NotConstraint(
        new DaysOfYear("May 23rd", "October 20th")
    ) // Take off some public holidays.
)
```

## Recurring business deadlines

As well as calculating business time, it's often useful to make calculations
about deadlines or "cut-off" times. For example, the cut-off time for
dispatching orders might be 11am on week days. BusinessTime provides logic for
dealing with this.

You can create deadlines using the same time constraints described above:

```typescript
const deadline = new RecurringDeadline(new WeekDays(), new HoursOfDay("11"))
```

Any time matching all the constraints is considered an occurrence of the
deadline. This means the deadline recurs on a regular basis (it is not a single
moment in time).

To find out when the deadline next occurs, you can use the
`nextOccurrenceFrom()` method:

```typescript
const time = moment.utc()
deadline.nextOccurrenceFrom(time)
// = a moment.Moment instance for the time the deadline next occurs.
```

In this example, this might give you 11am today, or 11am next Monday if it's now
already later than 11am on a Friday.

There is a `previousOccurrenceFrom()` that does the equivalent going back from
the given time.

You can also see if a deadline has passed in a given time period:

```typescript
deadline.hasPassedToday()
// = true if the deadline has been passed today.
deadline.hasPassedBetween(
    moment.utc().subtract(1, "hour"),
    moment.utc().add(1, "hour")
)
// = true if the deadline is ever passed in the given time period.
```

*Important*: the deadlines described above are designed to handle recurring
deadlines. They not appropriate for determining singular moments in time. To
make comparisons against a single moment, you should simply use the comparison
methods provided by Moment:

```typescript
const time = moment.utc()
const singleTime = moment.utc("2019-02-18T13:50:18.475Z")
time.isAfter(singleTime)
// = true if the moment has passed.
```

## Business time factory

You probably don't want to have to set up an instance of `BusinessTime` in every
place you want to use one in your code.

To avoid that, you can set up a `BusinessTimeFactory` with the constraints you
need once and then use that everywhere.

For example:

```typescript
const factory = new BusinessTimeFactory().withConstraints(
    new DaysOfWeek("Monday", "Tuesday"),
    new BetweenHoursOfDay("13", "18"),
)
```

Once the factory is set up, you can share it in whatever way you usually share
dependencies, for example a dependency injection framework or your own
application setup process.

When you've got the instance of the factory, you can get a ready-made instance
of `BusinessTime` from it:

```typescript
const someTime = factory.make(moment.utc("2019-02-18T13:50:18.475Z"))
const now = factory.now()
```

## Precision

By default, BusinessTime uses hour precision. This means that it calculates
business time roughly accurate to an hour.

If you need better precision than this, you can set it to what you want:

```typescript
const hourPrecision = new BusinessTime().withPrecision(
    moment.duration(1, "hour")
)
const halfHourPrecision = new BusinessTime().withPrecision(
    moment.duration(30, "minutes")
)
const fifteenMinutePrecision = new BusinessTime().withPrecision(
    moment.duration(15, "minutes")
)
```

You can also set precision on the business time factory in the same way.

Note that the higher the precision, the lower the performance is. This is
because BusinessTime must check each interval of the size you specify. For
example, at hour precision, dealing with one week requires `7 * 24 = 168`
iterations. At minute precision, this becomes `7 * 24 * 60 = 10080`
iterations, which is 60× slower.

Always try to set the largest precision interval that covers your needs.
