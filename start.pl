#!/usr/bin/perl
use warnings;
use strict;

my $pwd= $ARGV[0];
# print $pwd;

my $checkNode= `echo $pwd | sudo -S dpkg -l | grep nodejs`;

if (length($checkNode) < 3) {
    my $update=`echo $pwd | sudo -S apt-get update`;
    print "-------------------------_$update-----------------------";
    if ($update=~ m/[error]/) {
        die "There seems to be a problem \n $update\n";
    }

    my $installNodeJS= `echo $pwd | sudo -S apt-get install nodejs`;
    print "//////////////////////$installNodeJS//////////////////////";
    if ($installNodeJS=~ m/error/) {
        die "ERROR \n $installNodeJS";
    }
    my $installNPM= `echo $pwd | sudo -S apt-get install npm`;
    print "<<<<<<<<<<<<<<<<<<<<<$installNPM>>>>>>>>>>>>>>>>>>>>>>>>>";
    if ($installNPM=~ m/error/) {
        die "ERROR \n $installNPM\n";
    }

}

`npm start`;


