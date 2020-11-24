$(function(){
	var qSub             = $("#q-sub"),
	    rateInput        = $("#rate"),
		lowerMiddleScore = $("#lower-middle-score-UW"),
		monthlyIncomeSum = $("#monthlyIncomeSum"),
		cltv             = $("#cltv"),
		firstMtgLtv      = $("#firstMtgLtv"),
		secondMtgLtv     = $("#secondMtgLtv"),
		qualPayment      = $("#qualPayment"),
		qInterest        = $("#qInterest"),
		frontendDTI      = $("#frontendDTI"),
		
		currPrimeRate     = parseFloat($("#primeRate").val()),
		currMargin        = parseFloat($("#margin").val());
		currRate          = parseFloat(rateInput.html()),
		currBorrower      = $("#borrowerRate").val(),
		currCoBorrower    = $("#coBorrowerRate").val(),
		currBorrowerInc   = 0,
		currCoBorrowerInc = 0,
		currQual          = parseFloat(qualPayment.html()),
		heloc             = $("#helocLineAmount").val(),
		currQInterest     = parseFloat($("#qInterest").val()),
		currPurchasePrice = parseFloat($("#purchasePrice").val()),
		curr1stMtgBal     = parseFloat($("#firstMtgBalance").val()),
	   
	    currHazardInsurance = parseFloat($("#hazardInsurance").val()),
		currPropertyTaxes   = parseFloat($("#propertyTaxes").val()),
		currHOADues         = parseFloat($("#HOADues").val()),
		other               = parseFloat($("#other").val()),
		curr1stMtgPayment   = parseFloat($("#firstMtgPayment").val());

		currMonthlyIncomeTotal = 0,
		currTotalHouse         = 0,
		currOtherPayments      = 0;

	$(document).on("input change", qSub, function(e) {
		var id = e.target.id;

		if (id == "primeRate" || id == "margin") {
			if (id == "primeRate") {
				currPrimeRate = parseFloat($("#primeRate").val());
			}
			if (id == "margin") {
				currMargin = parseFloat($("#margin").val());
			}

			currRate = get_rate(currPrimeRate, currMargin);
			currQual = get_qual(currRate, heloc);
			currQInterest = get_qInterest(currRate, heloc);

			rateInput.html(currRate);
			qualPayment.html(currQual);
			qInterest.html(currQInterest);

		}
		if (id == "borrowerRate" || id == "coBorrowerRate") {
			if (id == "borrowerRate") {
				currBorrower = $("#borrowerRate").val();
			} else {
				currCoBorrower = $("#coBorrowerRate").val();
			}
			lowerMiddleScore.html(get_min(currBorrower, currCoBorrower));
		}

		if (id == "borrowerMonthlyIncome" || id == "coBorrowerMonthlyIncome") {
			if (id == "borrowerMonthlyIncome") {
				currBorrowerInc   = parseFloat($("#borrowerMonthlyIncome").val());
			} else {
				currCoBorrowerInc = parseFloat($("#coBorrowerMonthlyIncome").val());
			}
			if (currTotalHouse == 0) {
				currTotalHouse = parseFloat($("#totalHousing").html());
			}
			console.log(currTotalHouse);
			currMonthlyIncomeTotal = get_monthly_income(currBorrowerInc, currCoBorrowerInc);
			monthlyIncomeSum.html(currMonthlyIncomeTotal);
			
			frontendDTI.html(get_frontend_dti(currMonthlyIncomeTotal, currTotalHouse));
			
		}

		if (id == "purchasePrice" || id == "firstMtgBalance" || id == "helocLineAmount") {
			
			if (id == "purchasePrice") {
				currPurchasePrice = parseFloat($("#purchasePrice").val());
			} else if (id == "firstMtgBalance") {
				curr1stMtgBal = parseFloat($("#firstMtgBalance").val());
			} else { // if (id == "helocLineAmount")
				heloc = parseFloat($("#helocLineAmount").val());
				currQual = get_qual(currRate, heloc);
				currQInterest = get_qInterest(currRate, heloc);

				qualPayment.html(currQual);
				qInterest.html(currQInterest);
			}

			cltv.html(get_cltv(curr1stMtgBal, heloc, currPurchasePrice));
			firstMtgLtv.html(get_first_mtg_ltv(curr1stMtgBal, currPurchasePrice));
			secondMtgLtv.html(get_second_mtg_ltv(heloc, currPurchasePrice));
	
		}

		if (id == "hazardInsurance" || id == "propertyTaxes" || id == "HOADues" || id == "other" || id == "firstMtgPayment" || id == "qualPayment" ) {
		    if (id == "hazardInsurance") {
			    currHazardInsurance = parseFloat($("#hazardInsurance").val());
			} else if (id == "propertyTaxes") {
				currPropertyTaxes = parseFloat($("#propertyTaxes").val());
			} else if (id == "HOADues") {
				currHOADues = parseFloat($("#HOADues").val());
			} else if (id == "other") {
				other = parseFloat($("#other").val());
			} else if (id == firstMtgPayment) {
				curr1stMtgPayment = parseFloat($("#firstMtgPayment").val());
			} else {
				currQual = parseFloat($("qualPayment").val());
			}
			if (currOtherPayments == 0) {
				currOtherPayments = parseFloat($("#otherPayments").val());
			}
			if (currMonthlyIncomeTotal == 0) {
				currMonthlyIncomeTotal = get_monthly_income(currBorrowerInc, currCoBorrowerInc);
			}

			currTotalHouse = get_total_housing([currHazardInsurance, currPropertyTaxes, currHOADues, other, curr1stMtgPayment, currQual]);
			

			$("#totalHousing").html(currTotalHouse);
			$("#totalPayments").html(get_total_payments([currTotalHouse, currOtherPayments]));

			frontendDTI.html(get_frontend_dti(currMonthlyIncomeTotal, currTotalHouse));
		}
		if (id == "otherPayments") {
			currOtherPayments = parseFloat($("#otherPayments").val());
			if (currTotalHouse == 0) {
				currTotalHouse = parseFloat($("#totalHousing").html());
			}
			$("#totalPayments").html(get_total_payments([currTotalHouse, currOtherPayments]));
		}

	});

});

function get_rate(prime_rate, margin) {
	return (prime_rate + margin).toFixed(2);;
}
function get_qual(curr_rate, curr_heloc) {
	return pmt(parseFloat(curr_rate / 12), 240, curr_heloc);
}
function get_qInterest(curr_rate, curr_heloc) {
	return ((curr_heloc * parseFloat(curr_rate / 360)) * 30).toFixed(2);
}
function get_monthly_income (borrower_income, coborrower_income) {
	return (borrower_income + coborrower_income).toFixed(2);
}
function get_frontend_dti(monthly_income, total_housing) {
	return  (total_housing / monthly_income).toFixed(2);
}
function get_cltv(first_mtg_bal, curr_heloc, purchase_price) {
	return (first_mtg_bal + curr_heloc) / purchase_price;
}
function get_first_mtg_ltv(first_mtg_bal, purchase_price) {
	console.log(first_mtg_bal);
	console.log(purchase_price);
	return (first_mtg_bal / purchase_price).toFixed(2);
}
function get_second_mtg_ltv(curr_heloc, purchase_price) {
	return (curr_heloc / purchase_price).toFixed(4);
}
function get_total_housing(housing_expenses) {
	return sum(housing_expenses);
}
function get_total_payments(expenses) {
	return sum(expenses);
}

function sum(arr) {
	var sum = 0;

	for (var i = 0; i < arr.length; i++) {
		sum += arr[i];
	}
	return sum;
}
function get_min(input_a, input_b) {
	return Math.min(input_a, input_b)
}

function pmt(rate_per_period, number_of_payments, present_value){
	console.log(rate_per_period);
	console.log(number_of_payments);
	console.log(present_value);

	// Interest rate exists
	var q = Math.pow(1 + rate_per_period, number_of_payments);
	console.log((present_value) * (rate_per_period) / (1 - (Math.pow(1 + rate_per_period, -number_of_payments))));
	return (present_value) * (rate_per_period) / (1 - (Math.pow(1 + rate_per_period, -number_of_payments)));

}
