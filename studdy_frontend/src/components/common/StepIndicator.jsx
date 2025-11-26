import React from 'react';

const StepIndicator = ({ currentStep, steps, className = '' }) => {
  return (
    <div className={`step-indicator ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className={`step-circle ${currentStep >= step.number ? 'step-active' : 'step-inactive'}`}>
            {step.number}
          </div>
          {index < steps.length - 1 && (
            <div className={`step-connector ${currentStep > step.number ? 'step-connector-active' : 'step-connector-inactive'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;