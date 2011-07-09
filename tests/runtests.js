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
		var header = document.createElement( "H2" );
		header.appendChild( document.createTextNode( k ) );
		document.body.appendChild( header );
		if ( typeof console !== "undefined" ) { console.group( k ); }
		try {
			window[ k ]();
			header.className = "pass";
		} catch ( e ) {
			passed = false;
			header.className = "fail";
			var pre = document.createElement( "PRE" );
			pre.appendChild( document.createTextNode(
					e.toString() + "\n" + e.stack ) );
			document.body.appendChild( pre );
		}
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
