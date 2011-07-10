//-*- mode: js2-mode; indent-tabs-mode: t; tab-width: 2; -*-

( function () {
	var header = document.createElement( "H1" );
	header.appendChild( document.createTextNode( document.title ) );
	document.body.appendChild( header );

	var filter = /^test/;

	var m = document.location.search.match( /[&?]testFilter=([^&#]*)/ );
	if ( m ) { filter = new RegExp( decodeURIComponent( m[ 1 ] ) ); }

	var nTests = 0;
	var passed = true;
	for ( var k in window ) {
		if ( !( /^test/.test( k ) && filter.test( k ) ) ) { continue; }
		++nTests;
		var knownFailure = window[ k ].knownFailure;
		var testHeader = document.createElement( "H2" );
		var testTitle = k + (knownFailure ? " [expected to fail]" : "");
		testHeader.appendChild( document.createTextNode( testTitle ) );
		document.body.appendChild( testHeader );
		if ( typeof console !== "undefined" ) { console.group( k ); }
		var t0 = new Date, t1;
		try {
			window[ k ]();
			t1 = new Date;
			testHeader.className = "pass";
			if ( knownFailure ) {
				if ( typeof console !== "undefined" ) {
					console.warn( k + " passed but was expected to fail" );
				}
			}
		} catch ( e ) {
			t1 = new Date;
			if ( !knownFailure ) {
				passed = false;
			}
			testHeader.className = knownFailure ? "known-failure" : "fail";
			var pre = document.createElement( "PRE" );
			pre.appendChild( document.createTextNode(
					e.toString() + "\n" + e.stack ) );
			document.body.appendChild( pre );
		}
		var runtimeReport = document.createElement("small");
		runtimeReport.appendChild(
			document.createTextNode(" (took " + (t1 - t0) + "ms)"));
		testHeader.appendChild(runtimeReport);
		if ( typeof console !== "undefined" ) { console.groupEnd( k ); }
	}

	assertTrue( nTests > 0 );

	document.body.style.backgroundColor = passed ? "#efe" : "#fee";
	if ( passed ) {
		location.href = "#OK";
	} else {
		location.href = "#FAIL";
	}
} )();
