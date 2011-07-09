//-*- mode: js2-mode; indent-tabs-mode: t; tab-width: 2; -*-

// Simple unit-testing utilities used by *Test.js and *Test.html

/**
 * May be called with 2 or 3 parameters.  If called with 3 then the first is a
 * message.
 */
function assertEquals( msg, a, b ) {
	if ( arguments.length === 2 ) {
		b = arguments[ 1 ];
		a = arguments[ 0 ];
		msg = null;
	}
	if ( a !== b ) {
		if ( typeof console !== "undefined" ) {
			console.error(
					"%s: Expected\n\t(%o : %s)\nbut was\n\t(%o : %s)",
					msg || "Inequal",
					a, typeof a, b, typeof b );
			console.trace();
		}
		throw new Error(
				( msg || "Inequal" ) + ": Expected\n\t(" + a + " : " + ( typeof a )
				+ ")\nbut was\n\t(" + b + " : " + ( typeof b ) + ")" );
	}
}

function assertTruthy( msg, cond ) {
	assertTrue( msg, !!cond );
}

function assertTrue( msg, cond ) {
	if ( arguments.length === 1 ) {
		cond = arguments[ 0 ];
		msg = null;
	}
	if ( cond !== true ) {
		if ( typeof console !== "undefined" ) {
			console.error(
				"%s: Condition was not true\n\t(%o : %s)",
				msg || "Inequal",
				cond, typeof cond );
			console.trace();
		}
		throw new Error(
				( msg || "Inequal" ) + ": Condition was not true\n\t(" + cond + " : "
				+ ( typeof cond ) + ")" );
	}
}

function assertFalsey( msg, cond ) {
	assertFalse( msg, !!cond );
}

function assertFalse( msg, cond ) {
	if ( arguments.length === 1 ) {
		cond = arguments[ 0 ];
		msg = null;
	}
	if ( cond !== false ) {
		if ( typeof console !== "undefined" ) {
			console.error(
				"%s: Condition was not false\n\t(%o : %s)",
				msg || "Inequal",
				cond, typeof cond );
			console.trace();
		}
		throw new Error(
				( msg || "Inequal" ) + ": Condition was not true\n\t(" + cond + " : "
				+ ( typeof cond ) + ")" );
	}
}

function fail( msg ) {
	if ( typeof console !== "undefined" ) {
		console.error( msg );
		console.trace();
	}
	throw new Error( msg );
}
