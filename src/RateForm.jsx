import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { calculateRate, NIGHTS, PEOPLE, ROOM_TYPES } from './Constants';

const CalculatedSection = ({ calculatedRate, occupancy, duration, }) => (
  <div className="wrapper">
    <div>
      The rate per person for {duration} nights is ${calculatedRate}.
    </div>
    <div>
      The rate for the whole room is ${Number(calculatedRate * occupancy).toFixed(2)}.
    </div>
  </div>
);

const RateForm = () => {
  const [calculatedRate, setCalculatedRate] = useState(0);
  const { register, handleSubmit, watch, getValues, formState: { isSubmitSuccessful, errors } } = useForm({mode: "all"});

  const onSubmit = (data) => {
    setCalculatedRate(calculateRate(data));
  }

  const validateDuration = (value) => {
    const {startDate} = getValues();
    const day = new Date(startDate).getUTCDate();
    if ((Number(value) + day) > 13) return `Please enter ${13 - day} nights or less`
    return null;
  }

  useEffect(() => {
    handleSubmit(onSubmit)();
  }, [])

  useEffect(() => {
    const subscription = watch(handleSubmit(onSubmit));
    return () => subscription.unsubscribe();
}, [handleSubmit, watch]);

  return (
    <>
      <div className="wrapper">
        <header className="App-header">
          Calculate room rates
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="startDate">Check-in date: </label>
            <input
              {...register("startDate", {
              })}
              type="date"
              id="startDate"
              name="startDate"
              min="2023-11-08"
              max="2023-11-10"
              defaultValue="2023-11-09"
            />
          </div>
          <div>
            <label htmlFor="duration">Nights: </label>
            <select
              {...register("duration", {validate: validateDuration})}
              id="duration"
              name="duration"
            >
              {NIGHTS.map((val) => (<option key={val} value={val}>{val}</option>))}
            </select>
            {errors?.duration && (<span className="error">{errors?.duration?.message}</span>)}
          </div>
          <div>
            <label htmlFor="occupancy">Number of people: </label>
            <select {...register("occupancy")} id="occupancy" name="occupancy" defaultValue="2">
              {PEOPLE.map((val) => (<option key={val} value={val}>{val}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="roomType" name="roomType">Room type: </label>
            <select {...register("roomType")} id="roomType" name="roomType">
              {Object.entries(ROOM_TYPES).map(([key, value]) => (<option key={key} value={key}>{value}</option>) )}
            </select>
          </div>
        </form>
      </div>
      {isSubmitSuccessful && (
        <CalculatedSection 
          calculatedRate={calculatedRate}
          occupancy={Number(getValues()?.occupancy)}
          duration={getValues()?.duration}
        />
      )}
    </>
  );
}

export default RateForm;

