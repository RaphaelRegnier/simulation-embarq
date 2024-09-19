document.addEventListener("DOMContentLoaded", function() {
  // Function to check if an element is visible
  function isElementVisible(element) {
    return element.offsetParent !== null;
  }

  // Get the "simulation-form" element by its id
  const formElement = document.getElementById('simulation-form');

  if (formElement) {
    // Attach a click event listener to the form
    formElement.addEventListener('click', function(event) {
      // Get all inputs with the custom-code attribute
      const inputs = document.querySelectorAll('[custom-code="required-if-visible"]');

      // Loop through each input
      inputs.forEach(function(input) {
        // Check if the input or its parent is visible
        if (isElementVisible(input)) {
          // If the input is visible, add the required attribute
          input.required = true;
        } else {
          // If the input is not visible, remove the required attribute
          input.required = false;
        }
      });
    });
  }
});

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('simulation-form');
    const leadForm = document.getElementById('simulation-lead-form');
    const incomeTypeInputs = document.querySelectorAll('[name="income_type"]');
    const turnoverUnitInputs = document.querySelectorAll('[name="turnover_unit"]');
    const dailyRateInput = document.getElementById('Daily-Rate');
    const monthlyTurnoverInput = document.getElementById('Monthly-Turnover-Amount');
    const amountInput = document.getElementById('amount');
    const expensesAmountInput = document.getElementById('expenses_amount');
    const withHealthBenefitInputs = document.querySelectorAll('[name="with_health_benefit"]');
    const workedDaysInput = document.getElementById('Worked-Days');
    const resultDiv = document.getElementById('simulation_results');
    
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      //resultDiv.innerHTML = 'Loading...';

      const incomeType = getSelectedValue(incomeTypeInputs);
      const turnoverUnit = getSelectedValue(turnoverUnitInputs);
      const dailyRate = dailyRateInput.value;
      const monthlyTurnover = monthlyTurnoverInput.value;
      const amount = amountInput.value;
      const expensesAmount = expensesAmountInput.value;
      const withHealthBenefit = getSelectedValue(withHealthBenefitInputs);
      const workedDays = parseInt(workedDaysInput.value) || 0;
      
	 		// Populate hidden fields in lead form
      document.getElementById('Monthly-Turnover-Amount-2').value = monthlyTurnover;
      document.getElementById('Daily-Rate-2').value = dailyRate;
      document.getElementById('Worked-Days-2').value = workedDays;
      document.getElementById('Expenses-Amount-2').value = expensesAmount;
      document.getElementById('Amount-2').value = amount;
      leadForm.querySelector('[name="with_health_benefit_2"]').value = withHealthBenefit;
		
      
      let apiUrl;

      if (incomeType === 'invoicing') {
        if (turnoverUnit === 'daily_rate') {
          apiUrl = `https://calypso-api.herokuapp.com/pay_simulations/results?amount_type=${incomeType}&amount=${dailyRate * workedDays}&contract_type=permanent&expenses_amount=${expensesAmount}&management_fees_cap=600&management_fees_percent=0.06&lunch_vouchers_amount=0&extra_management_fees_percent=0&with_health_benefit=${withHealthBenefit}&api_key=86bd6fa7-8d64-10e46-92cf-04cc920e252e`;
        } else {
          apiUrl = `https://calypso-api.herokuapp.com/pay_simulations/results?amount_type=${incomeType}&amount=${monthlyTurnover}&contract_type=permanent&expenses_amount=${expensesAmount}&management_fees_cap=600&management_fees_percent=0.06&lunch_vouchers_amount=0&extra_management_fees_percent=0&with_health_benefit=${withHealthBenefit}&api_key=86bd6fa7-8d64-10e46-92cf-04cc920e252e`;
        }
      } else {
        apiUrl = `https://calypso-api.herokuapp.com/pay_simulations/results?amount_type=${incomeType}&amount=${amount}&contract_type=permanent&expenses_amount=${expensesAmount}&management_fees_cap=600&management_fees_percent=0.06&lunch_vouchers_amount=0&extra_management_fees_percent=0&with_health_benefit=${withHealthBenefit}&api_key=86bd6fa7-8d64-10e46-92cf-04cc920e252e`;
      }

      fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Une erreur HTTP est survenue, code: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
            // Round the numbers and add " €"
            const roundAndFormat = value => Math.round(value) + " €";

            // Inject rounded and formatted values into respective divs
            document.getElementById('invoicing_result').textContent = roundAndFormat(data.invoicing);
            document.getElementById('management_fees_result').textContent = roundAndFormat(data.management_fees);
            document.getElementById('expenses_amount_result').textContent = roundAndFormat(data.expenses_amount);
            document.getElementById('base_result').textContent = roundAndFormat(data.base);
            document.getElementById('gross_salary_result').textContent = roundAndFormat(data.gross_salary);
            document.getElementById('employer_contributions_result').textContent = roundAndFormat(data.employer_contributions);
            document.getElementById('employee_contributions_result').textContent = roundAndFormat(data.employee_contributions);
            document.getElementById('net_salary_result').textContent = roundAndFormat(data.net_salary);
						
        })
        .catch(error => {
          resultDiv.innerHTML = `Une erreur est survenue: ${error.message}`;
          console.error('Fetch error:', error);
        });
    });

    function getSelectedValue(inputs) {
      for (const input of inputs) {
        if (input.checked) {
          return input.value;
        }
      }
      return null;
    }
  });

	$( "#redo-button" ).click(function() {
  		location.reload();
	});
