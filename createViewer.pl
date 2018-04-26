use warnings;
use strict;


my $dir= $ARGV[0];

    open VIEWER, ">>$dir.html" or die $!;
    print VIEWER "<html>
    <head>

    </head>
    <body>
        <object data=\"$dir/$dir.svg\" type=\"image/svg+xml\">
        </object>
    </body>
</html>";
close VIEWER;
`firefox $dir.html`;
