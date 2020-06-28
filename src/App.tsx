import React from 'react';
import {
	Card,
	CardContent,
	Box,
	FormGroup,
	Container,
	Typography,
	FormControlLabel,
	Checkbox,
	MenuItem,
	Button,
	CircularProgress,
	FormHelperText,
} from '@material-ui/core';
import { Field, Formik, Form, ErrorMessage, useField } from 'formik';
import { array, boolean, mixed, number, object, string } from 'yup';

import { CheckboxWithLabel, TextField } from 'formik-material-ui';

export interface InvestmentDetails {
	fullName: string;
	initialInvestment?: number;
	investmentRisk: Array<'High' | 'Medium' | 'Low'>;
	commentAboutInvestmentRisk: string;
	dependents?: number;
	acceptedTermsAndConditions: boolean;
}

const initialValues: InvestmentDetails = {
	fullName: '',
	initialInvestment: 0,
	investmentRisk: [],
	commentAboutInvestmentRisk: '',
	dependents: -1,
	acceptedTermsAndConditions: false,
};

const validationSchema = object({
	fullName: string()
		.matches(/^[A-Za-z]+$/, 'not a valid name')
		.required('Your name is mandatory!')
		.min(2)
		.max(100),
	initialInvestment: number().required().min(100),
	dependents: number().required().min(0).max(5),
	acceptedTermsAndConditions: boolean().oneOf([true], 'must be checked'),
	investmentRisk: array(string().oneOf(['high', 'medium', 'low'])).min(
		1,
		'at least one should be checked'
	),
	commentAboutInvestmentRisk: mixed().when('investmentRisk', {
		is: (investmentRisk: string[]) =>
			investmentRisk.find((ir) => ir === 'high'),
		then: string().required().min(20).max(100),
		otherwise: string().min(20).max(100),
	}),
});

const sleep = (millSecs: number) =>
	new Promise((res) => setTimeout(res, millSecs));

function App() {
	return (
		<Container maxWidth='sm'>
			<Card>
				<CardContent>
					<Typography align='center' color='primary' variant='h5'>
						New Bank Account
					</Typography>
					<Formik
						validationSchema={validationSchema}
						initialValues={initialValues}
						onSubmit={async (values, helpers) => {
							await sleep(3000);
							helpers.resetForm();
							console.log(values);
						}}
					>
						{({ values, isSubmitting, isValidating, errors, getFieldMeta }) => (
							<Form>
								<Box marginBottom={2} marginTop={2}>
									<Field
										fullWidth
										name='fullName'
										component={TextField}
										label='Full Name'
									/>
								</Box>
								<Box marginBottom={2} marginTop={1}>
									<Field
										fullWidth
										name='initialInvestment'
										type='number'
										component={TextField}
										label='Initial Investment'
									/>
								</Box>
								<Box>
									<label>Select the risk you want to take: </label>
									<Field
										color='primary'
										component={CheckboxWithLabel}
										type='checkbox'
										name='investmentRisk'
										value='high'
										Label={{ label: 'High' }}
									/>
									<Field
										color='primary'
										component={CheckboxWithLabel}
										type='checkbox'
										name='investmentRisk'
										value='medium'
										Label={{ label: 'Medium' }}
									/>
									<Field
										color='primary'
										component={CheckboxWithLabel}
										type='checkbox'
										name='investmentRisk'
										value='low'
										Label={{ label: 'Low' }}
									/>
									{getFieldMeta('investmentRisk').error ? (
										<FormHelperText error>
											{getFieldMeta('investmentRisk').error}
										</FormHelperText>
									) : null}
								</Box>
								<Box marginBottom={2}>
									<Field
										fullWidth
										name='commentAboutInvestmentRisk'
										component={TextField}
										multiline
										rows={3}
										rowsMax={10}
										label='Comment About Investment Risk'
									/>
								</Box>
								<Box marginBottom={2}>
									<Field
										fullWidth
										name='dependents'
										label='dependents'
										component={TextField}
										select
									>
										<MenuItem value={-1}>Select ...</MenuItem>
										<MenuItem value={0}>0</MenuItem>
										<MenuItem value={1}>1</MenuItem>
										<MenuItem value={2}>2</MenuItem>
										<MenuItem value={3}>3</MenuItem>
										<MenuItem value={4}>4</MenuItem>
										<MenuItem value={5}>5</MenuItem>
									</Field>
								</Box>

								<Box marginBottom={2}>
									<Field
										color='primary'
										component={CheckboxWithLabel}
										type='checkbox'
										name='acceptedTermsAndConditions'
										Label={{ label: 'Accept terms and conditions' }}
									/>
									{getFieldMeta('acceptedTermsAndConditions').error ? (
										<FormHelperText error>
											{getFieldMeta('acceptedTermsAndConditions').error}
										</FormHelperText>
									) : null}
								</Box>

								<Button
									startIcon={
										isSubmitting || isValidating ? (
											<CircularProgress size='1rem' />
										) : null
									}
									variant='contained'
									color='primary'
									type='submit'
									disabled={isSubmitting || isValidating}
								>
									Submit
								</Button>
							</Form>
						)}
					</Formik>
				</CardContent>
			</Card>
		</Container>
	);
}

export default App;

// interface LabeledCheckboxProps {
// 	name: string;
// 	label: string;
// 	value?: string | number;
// }

// const LabeledCheckbox: React.FC<LabeledCheckboxProps> = ({
// 	label,
// 	...props
// }) => {
// 	const [field] = useField({
// 		type: 'checkbox',
// 		...props,
// 	});

// 	return (
// 		<FormControlLabel
// 			control={<Checkbox color='primary' {...props} {...field} />}
// 			label={label}
// 		/>
// 	);
// };
