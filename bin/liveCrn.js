/*
var Mem = require('memcached');
<<<<<<< HEAD
var memServer =   new Mem('schedular.luawsd.cfg.usw2.cache.amazonaws.com:11211');
//var memServer=new Mem('127.0.0.1:11211');
=======
//var mem =   new memcached('schedular.luawsd.cfg.usw2.cache.amazonaws.com:11211');
var memServer = new Mem('127.0.0.1:11211');
>>>>>>> dev
//Variables for CRN and memcached
var CRN_UPDATE_KEY = "createTime";
var CRN_PREFIX = "crn_";
//Okay, don't judge me..
var CRN_ARRAY = ['crn_20160', 'crn_10023', 'crn_10024', 'crn_10025', 'crn_11545', 'crn_10026', 'crn_10027', 'crn_10028', 'crn_11255', 'crn_11256', 'crn_11257', 'crn_11252', 'crn_11258', 'crn_11259', 'crn_11260', 'crn_20160', 'crn_11261', 'crn_11262', 'crn_11263', 'crn_11253', 'crn_11264', 'crn_11265', 'crn_11266', 'crn_11267', 'crn_11268', 'crn_11269', 'crn_10029', 'crn_10030', 'crn_10031', 'crn_10032', 'crn_10033', 'crn_10034', 'crn_11505', 'crn_10035', 'crn_10036', 'crn_10037', 'crn_10038', 'crn_20160', 'crn_10039', 'crn_10040', 'crn_10041', 'crn_10042', 'crn_10043', 'crn_10044', 'crn_10045', 'crn_10046', 'crn_10047', 'crn_10048', 'crn_10049', 'crn_10050', 'crn_10051', 'crn_10052', 'crn_10053', 'crn_10054', 'crn_10055', 'crn_10056', 'crn_10057', 'crn_10058', 'crn_10059', 'crn_20160', 'crn_10060', 'crn_10061', 'crn_10062', 'crn_10063', 'crn_10064', 'crn_10065', 'crn_10066', 'crn_10067', 'crn_10068', 'crn_10069', 'crn_10070', 'crn_10071', 'crn_10072', 'crn_10074', 'crn_10075', 'crn_10076', 'crn_10077', 'crn_10078', 'crn_10080', 'crn_10079', 'crn_10081', 'crn_10082', 'crn_10083', 'crn_10084', 'crn_10085', 'crn_10086', 'crn_10087', 'crn_20160', 'crn_10088', 'crn_10089', 'crn_10090', 'crn_10091', 'crn_10092', 'crn_10093', 'crn_10094', 'crn_10095', 'crn_10096', 'crn_10097', 'crn_10098', 'crn_10099', 'crn_10100', 'crn_10101', 'crn_11552', 'crn_10102', 'crn_10103', 'crn_10104', 'crn_10105', 'crn_10106', 'crn_10107', 'crn_20160', 'crn_10108', 'crn_10109', 'crn_10110', 'crn_10111', 'crn_10112', 'crn_10113', 'crn_10114', 'crn_10115', 'crn_10116', 'crn_10117', 'crn_10118', 'crn_10119', 'crn_11517', 'crn_10120', 'crn_10121', 'crn_10122', 'crn_10123', 'crn_11511', 'crn_10124', 'crn_10125', 'crn_10126', 'crn_10127', 'crn_10128', 'crn_10129', 'crn_20160', 'crn_10130', 'crn_10131', 'crn_10132', 'crn_10133', 'crn_10134', 'crn_10135', 'crn_10136', 'crn_10137', 'crn_10138', 'crn_10139', 'crn_10140', 'crn_10141', 'crn_10142', 'crn_10143', 'crn_10144', 'crn_10145', 'crn_10146', 'crn_10147', 'crn_10148', 'crn_10149', 'crn_10150', 'crn_10151', 'crn_10152', 'crn_10153', 'crn_20160', 'crn_10154', 'crn_10155', 'crn_10156', 'crn_10157', 'crn_10158', 'crn_10159', 'crn_10160', 'crn_10161', 'crn_10162', 'crn_10163', 'crn_10164', 'crn_10165', 'crn_10166', 'crn_10167', 'crn_10168', 'crn_10169', 'crn_10170', 'crn_10171', 'crn_10172', 'crn_10173', 'crn_10174', 'crn_10175', 'crn_20160', 'crn_10176', 'crn_10177', 'crn_10178', 'crn_10179', 'crn_10180', 'crn_10181', 'crn_10182', 'crn_10183', 'crn_10184', 'crn_10185', 'crn_10186', 'crn_10187', 'crn_10188', 'crn_10189', 'crn_10190', 'crn_10191', 'crn_10192', 'crn_10193', 'crn_10194', 'crn_10195', 'crn_20160', 'crn_10196', 'crn_10197', 'crn_10198', 'crn_10199', 'crn_10200', 'crn_10201', 'crn_10202', 'crn_10203', 'crn_10204', 'crn_10205', 'crn_10206', 'crn_10207', 'crn_10208', 'crn_10209', 'crn_10210', 'crn_10211', 'crn_10212', 'crn_10213', 'crn_10214', 'crn_10215', 'crn_10216', 'crn_10217', 'crn_10218', 'crn_10219', 'crn_20160', 'crn_10220', 'crn_10221', 'crn_10222', 'crn_10223', 'crn_10224', 'crn_10225', 'crn_10226', 'crn_10227', 'crn_10228', 'crn_10229', 'crn_10230', 'crn_10231', 'crn_10232', 'crn_11466', 'crn_10233', 'crn_10234', 'crn_10235', 'crn_10236', 'crn_10237', 'crn_10238', 'crn_10239', 'crn_10240', 'crn_10241', 'crn_10242', 'crn_20160', 'crn_10243', 'crn_10244', 'crn_11524', 'crn_10245', 'crn_10246', 'crn_10247', 'crn_10248', 'crn_10249', 'crn_10250', 'crn_11523', 'crn_10251', 'crn_10252', 'crn_10253', 'crn_10254', 'crn_10255', 'crn_10256', 'crn_10257', 'crn_10258', 'crn_10259', 'crn_10260', 'crn_11525', 'crn_10261', 'crn_10262', 'crn_20160', 'crn_10265', 'crn_10266', 'crn_10267', 'crn_10268', 'crn_10269', 'crn_10270', 'crn_10271', 'crn_10272', 'crn_10273', 'crn_10274', 'crn_10275', 'crn_10276', 'crn_10277', 'crn_10278', 'crn_10279', 'crn_10280', 'crn_10281', 'crn_10282', 'crn_10283', 'crn_10284', 'crn_20160', 'crn_10285', 'crn_10286', 'crn_10287', 'crn_10288', 'crn_10289', 'crn_10290', 'crn_10291', 'crn_10292', 'crn_10293', 'crn_10294', 'crn_10295', 'crn_10296', 'crn_10297', 'crn_10298', 'crn_10299', 'crn_10300', 'crn_10301', 'crn_10302', 'crn_20160', 'crn_10303', 'crn_10304', 'crn_10305', 'crn_10306', 'crn_10307', 'crn_10308', 'crn_10309', 'crn_10310', 'crn_10311', 'crn_10312', 'crn_10313', 'crn_10314', 'crn_10315', 'crn_10316', 'crn_10317', 'crn_10318', 'crn_10319', 'crn_11485', 'crn_10320', 'crn_10321', 'crn_10322', 'crn_11473', 'crn_11474', 'crn_20160', 'crn_10323', 'crn_10324', 'crn_10325', 'crn_10326', 'crn_10327', 'crn_10328', 'crn_10329', 'crn_10330', 'crn_11507', 'crn_11508', 'crn_11509', 'crn_11510', 'crn_10331', 'crn_10332', 'crn_10333', 'crn_11514', 'crn_10334', 'crn_10335', 'crn_10336', 'crn_10337', 'crn_10338', 'crn_10339', 'crn_10340', 'crn_10341', 'crn_10342', 'crn_10343', 'crn_10344', 'crn_20160', 'crn_10345', 'crn_10346', 'crn_10347', 'crn_10348', 'crn_10349', 'crn_10350', 'crn_10351', 'crn_10352', 'crn_10353', 'crn_10354', 'crn_11548', 'crn_10355', 'crn_10356', 'crn_10357', 'crn_10358', 'crn_10359', 'crn_10360', 'crn_10361', 'crn_10362', 'crn_10363', 'crn_10364', 'crn_10365', 'crn_10366', 'crn_11549', 'crn_20160', 'crn_10367', 'crn_10368', 'crn_10369', 'crn_10370', 'crn_10371', 'crn_10372', 'crn_10373', 'crn_10374', 'crn_10375', 'crn_10376', 'crn_10377', 'crn_10378', 'crn_10379', 'crn_10380', 'crn_10381', 'crn_10382', 'crn_10383', 'crn_10384', 'crn_11540', 'crn_10385', 'crn_10386', 'crn_10387', 'crn_10388', 'crn_10389', 'crn_10390', 'crn_10391', 'crn_20160', 'crn_10392', 'crn_10393', 'crn_10394', 'crn_10395', 'crn_10396', 'crn_10397', 'crn_10398', 'crn_10399', 'crn_10400', 'crn_10401', 'crn_10402', 'crn_10403', 'crn_10404', 'crn_11512', 'crn_10405', 'crn_10406', 'crn_11513', 'crn_10407', 'crn_10408', 'crn_10009', 'crn_10020', 'crn_10018', 'crn_10010', 'crn_20160', 'crn_10019', 'crn_10011', 'crn_10012', 'crn_10013', 'crn_10014', 'crn_10015', 'crn_10016', 'crn_10017', 'crn_10409', 'crn_10410', 'crn_10411', 'crn_10412', 'crn_10413', 'crn_10414', 'crn_10415', 'crn_10416', 'crn_10417', 'crn_10418', 'crn_10419', 'crn_10420', 'crn_10421', 'crn_10422', 'crn_10423', 'crn_10424', 'crn_10425', 'crn_10426', 'crn_10427', 'crn_10428', 'crn_10429', 'crn_10430', 'crn_10431', 'crn_20160', 'crn_10432', 'crn_10433', 'crn_10434', 'crn_10435', 'crn_10436', 'crn_10437', 'crn_10438', 'crn_10439', 'crn_10440', 'crn_10441', 'crn_10442', 'crn_10443', 'crn_10444', 'crn_10445', 'crn_10446', 'crn_10447', 'crn_10448', 'crn_10449', 'crn_10450', 'crn_10451', 'crn_10452', 'crn_10453', 'crn_10454', 'crn_10455', 'crn_11527', 'crn_10456', 'crn_10457', 'crn_10458', 'crn_10459', 'crn_20160', 'crn_10460', 'crn_10461', 'crn_11471', 'crn_10462', 'crn_10463', 'crn_10464', 'crn_10465', 'crn_10466', 'crn_11529', 'crn_10467', 'crn_10470', 'crn_10471', 'crn_10472', 'crn_10473', 'crn_10474', 'crn_10475', 'crn_10476', 'crn_10477', 'crn_10478', 'crn_10479', 'crn_10480', 'crn_10481', 'crn_10482', 'crn_10483', 'crn_10484', 'crn_20160', 'crn_10485', 'crn_10486', 'crn_10487', 'crn_10488', 'crn_10489', 'crn_10490', 'crn_10491', 'crn_10492', 'crn_10493', 'crn_10494', 'crn_10495', 'crn_10496', 'crn_10497', 'crn_10498', 'crn_10499', 'crn_10500', 'crn_10501', 'crn_10502', 'crn_10503', 'crn_10504', 'crn_10505', 'crn_10506', 'crn_10507', 'crn_10508', 'crn_10509', 'crn_10510', 'crn_10511', 'crn_20160', 'crn_10512', 'crn_10513', 'crn_10514', 'crn_10515', 'crn_10516', 'crn_10517', 'crn_10518', 'crn_10519', 'crn_10520', 'crn_10521', 'crn_10522', 'crn_10523', 'crn_10524', 'crn_10525', 'crn_10526', 'crn_11543', 'crn_10527', 'crn_10528', 'crn_10529', 'crn_11541', 'crn_10530', 'crn_10531', 'crn_10532', 'crn_10533', 'crn_10534', 'crn_10535', 'crn_20160', 'crn_10536', 'crn_10537', 'crn_10538', 'crn_10539', 'crn_10540', 'crn_10541', 'crn_10542', 'crn_10543', 'crn_10544', 'crn_10545', 'crn_11326', 'crn_11327', 'crn_11328', 'crn_11329', 'crn_11330', 'crn_11331', 'crn_11332', 'crn_11333', 'crn_11334', 'crn_11335', 'crn_11336', 'crn_11337', 'crn_11338', 'crn_11339', 'crn_10546', 'crn_10547', 'crn_10548', 'crn_10549', 'crn_10550', 'crn_10551', 'crn_10552', 'crn_10553', 'crn_10554', 'crn_10555', 'crn_20160', 'crn_10556', 'crn_10557', 'crn_10558', 'crn_10559', 'crn_10560', 'crn_10561', 'crn_10562', 'crn_10563', 'crn_10564', 'crn_10565', 'crn_10566', 'crn_10567', 'crn_10569', 'crn_10570', 'crn_10571', 'crn_10572', 'crn_10573', 'crn_10574', 'crn_10575', 'crn_10576', 'crn_10577', 'crn_10578', 'crn_10579', 'crn_10580', 'crn_10581', 'crn_10582', 'crn_10583', 'crn_10584', 'crn_10568', 'crn_10585', 'crn_10586', 'crn_10587', 'crn_10588', 'crn_10589', 'crn_10590', 'crn_10591', 'crn_10592', 'crn_10593', 'crn_10594', 'crn_10595', 'crn_10596', 'crn_10597', 'crn_10598', 'crn_10599', 'crn_20160', 'crn_10600', 'crn_10601', 'crn_10602', 'crn_10603', 'crn_10604', 'crn_10605', 'crn_10606', 'crn_10607', 'crn_10608', 'crn_10609', 'crn_10610', 'crn_10611', 'crn_11550', 'crn_10612', 'crn_10613', 'crn_10614', 'crn_10615', 'crn_10616', 'crn_10617', 'crn_10618', 'crn_10619', 'crn_10620', 'crn_10621', 'crn_10622', 'crn_10623', 'crn_10624', 'crn_10625', 'crn_10626', 'crn_11463', 'crn_10627', 'crn_10628', 'crn_20160', 'crn_10629', 'crn_10630', 'crn_10631', 'crn_10632', 'crn_10633', 'crn_10634', 'crn_10635', 'crn_11503', 'crn_11495', 'crn_11489', 'crn_11493', 'crn_11497', 'crn_11502', 'crn_11496', 'crn_11490', 'crn_11499', 'crn_11491', 'crn_11494', 'crn_11500', 'crn_11528', 'crn_11501', 'crn_11492', 'crn_11498', 'crn_10636', 'crn_10637', 'crn_10638', 'crn_10639', 'crn_11464', 'crn_10640', 'crn_20160', 'crn_10641', 'crn_10642', 'crn_10643', 'crn_10644', 'crn_10645', 'crn_10646', 'crn_10647', 'crn_10648', 'crn_10649', 'crn_10650', 'crn_10651', 'crn_10652', 'crn_10653', 'crn_10654', 'crn_10655', 'crn_10656', 'crn_10657', 'crn_10658', 'crn_10659', 'crn_10660', 'crn_10661', 'crn_10662', 'crn_10663', 'crn_10664', 'crn_10665', 'crn_10666', 'crn_10667', 'crn_10668', 'crn_10669', 'crn_10670', 'crn_10671', 'crn_10672', 'crn_10673', 'crn_10674', 'crn_10675', 'crn_10676', 'crn_10677', 'crn_10678', 'crn_10679', 'crn_10680', 'crn_10681', 'crn_10682', 'crn_11468', 'crn_10683', 'crn_10684', 'crn_10685', 'crn_20160', 'crn_10686', 'crn_10687', 'crn_10688', 'crn_10689', 'crn_10690', 'crn_10691', 'crn_10692', 'crn_10693', 'crn_10694', 'crn_10695', 'crn_10696', 'crn_11479', 'crn_10697', 'crn_10698', 'crn_10699', 'crn_10700', 'crn_10701', 'crn_10702', 'crn_10703', 'crn_10704', 'crn_10705', 'crn_10706', 'crn_10707', 'crn_10708', 'crn_20160', 'crn_10709', 'crn_10710', 'crn_10711', 'crn_10712', 'crn_10713', 'crn_10714', 'crn_10715', 'crn_10716', 'crn_10717', 'crn_10718', 'crn_10719', 'crn_10720', 'crn_10721', 'crn_10722', 'crn_20160', 'crn_10723', 'crn_10724', 'crn_10725', 'crn_10726', 'crn_10727', 'crn_10728', 'crn_11547', 'crn_10729', 'crn_10730', 'crn_11538', 'crn_10731', 'crn_10732', 'crn_10733', 'crn_11535', 'crn_10734', 'crn_10735', 'crn_10736', 'crn_11536', 'crn_11537', 'crn_11539', 'crn_11534', 'crn_10737', 'crn_10738', 'crn_10739', 'crn_10740', 'crn_10741', 'crn_20160', 'crn_10742', 'crn_10743', 'crn_10744', 'crn_10745', 'crn_10746', 'crn_10747', 'crn_10748', 'crn_10749', 'crn_10750', 'crn_10751', 'crn_10752', 'crn_10753', 'crn_10754', 'crn_10755', 'crn_10756', 'crn_10757', 'crn_10758', 'crn_10759', 'crn_10760', 'crn_20160', 'crn_10761', 'crn_11469', 'crn_10762', 'crn_10763', 'crn_10764', 'crn_10765', 'crn_10766', 'crn_10767', 'crn_10768', 'crn_10769', 'crn_10770', 'crn_10771', 'crn_10772', 'crn_11482', 'crn_11480', 'crn_11483', 'crn_11481', 'crn_11279', 'crn_11280', 'crn_11281', 'crn_11282', 'crn_11283', 'crn_11284', 'crn_11272', 'crn_11285', 'crn_10773', 'crn_10774', 'crn_10775', 'crn_20160', 'crn_10776', 'crn_10777', 'crn_10778', 'crn_10779', 'crn_10780', 'crn_10781', 'crn_11484', 'crn_10782', 'crn_10783', 'crn_10784', 'crn_10785', 'crn_10786', 'crn_10787', 'crn_11515', 'crn_11516', 'crn_11531', 'crn_10788', 'crn_10789', 'crn_10790', 'crn_10791', 'crn_10792', 'crn_10793', 'crn_10794', 'crn_10795', 'crn_10796', 'crn_10797', 'crn_10798', 'crn_10799', 'crn_10800', 'crn_10801', 'crn_10802', 'crn_10803', 'crn_10804', 'crn_11546', 'crn_10805', 'crn_20160', 'crn_10806', 'crn_10807', 'crn_10808', 'crn_10809', 'crn_10810', 'crn_10811', 'crn_10812', 'crn_10813', 'crn_10814', 'crn_10815', 'crn_10816', 'crn_10817', 'crn_10818', 'crn_10819', 'crn_10820', 'crn_10821', 'crn_10822', 'crn_10823', 'crn_10824', 'crn_10825', 'crn_10826', 'crn_10827', 'crn_20160', 'crn_10828', 'crn_10829', 'crn_10830', 'crn_10831', 'crn_10832', 'crn_10833', 'crn_10834', 'crn_10835', 'crn_10836', 'crn_10837', 'crn_10838', 'crn_10839', 'crn_10840', 'crn_10841', 'crn_10842', 'crn_10843', 'crn_10844', 'crn_10845', 'crn_10846', 'crn_10847', 'crn_10848', 'crn_10849', 'crn_20160', 'crn_10850', 'crn_10851', 'crn_10852', 'crn_10853', 'crn_10854', 'crn_10855', 'crn_10856', 'crn_10857', 'crn_10858', 'crn_10859', 'crn_10860', 'crn_10861', 'crn_10862', 'crn_10863', 'crn_10864', 'crn_10865', 'crn_11486', 'crn_11488', 'crn_11506', 'crn_11533', 'crn_11487', 'crn_10866', 'crn_10867', 'crn_10868', 'crn_10869', 'crn_10870', 'crn_10871', 'crn_10872', 'crn_10873', 'crn_10874', 'crn_20160', 'crn_10875', 'crn_10876', 'crn_10877', 'crn_10878', 'crn_10879', 'crn_10880', 'crn_20160', 'crn_10881', 'crn_10882', 'crn_20160', 'crn_10883', 'crn_10884', 'crn_20160', 'crn_10885', 'crn_10886', 'crn_10887', 'crn_10888', 'crn_20160', 'crn_10889', 'crn_10890', 'crn_11270', 'crn_10891', 'crn_10892', 'crn_10893', 'crn_10894', 'crn_10895', 'crn_10896', 'crn_10897', 'crn_10898', 'crn_20160', 'crn_10899', 'crn_11504', 'crn_10900', 'crn_10901', 'crn_10902', 'crn_10903', 'crn_10904', 'crn_10905', 'crn_10906', 'crn_10909', 'crn_10910', 'crn_10911', 'crn_10912', 'crn_10913', 'crn_10914', 'crn_10915', 'crn_10916', 'crn_10917', 'crn_10918', 'crn_20160', 'crn_10919', 'crn_10920', 'crn_10921', 'crn_10922', 'crn_10923', 'crn_11475', 'crn_11476', 'crn_10924', 'crn_10925', 'crn_10926', 'crn_10927', 'crn_10928', 'crn_10929', 'crn_10930', 'crn_10931', 'crn_10932', 'crn_10933', 'crn_20160', 'crn_10934', 'crn_10935', 'crn_10936', 'crn_10937', 'crn_10938', 'crn_11286', 'crn_11287', 'crn_11288', 'crn_11289', 'crn_11290', 'crn_11291', 'crn_11292', 'crn_11293', 'crn_11294', 'crn_11295', 'crn_11296', 'crn_11297', 'crn_11310', 'crn_11298', 'crn_11299', 'crn_11273', 'crn_11274', 'crn_11275', 'crn_11276', 'crn_11277', 'crn_11278', 'crn_11300', 'crn_10939', 'crn_10940', 'crn_10941', 'crn_10942', 'crn_10943', 'crn_10944', 'crn_10945', 'crn_10946', 'crn_10947', 'crn_10948', 'crn_20160', 'crn_10949', 'crn_10950', 'crn_10951', 'crn_10952', 'crn_10953', 'crn_10954', 'crn_10955', 'crn_10956', 'crn_10957', 'crn_10958', 'crn_10959', 'crn_10960', 'crn_10961', 'crn_11521', 'crn_11522', 'crn_11467', 'crn_10962', 'crn_10963', 'crn_10964', 'crn_10965', 'crn_10966', 'crn_10967', 'crn_10968', 'crn_10969', 'crn_10970', 'crn_10971', 'crn_10972', 'crn_10973', 'crn_10974', 'crn_10975', 'crn_10976', 'crn_10977', 'crn_20160', 'crn_10978', 'crn_10979', 'crn_10980', 'crn_10981', 'crn_10982', 'crn_10983', 'crn_10984', 'crn_10985', 'crn_10986', 'crn_10987', 'crn_10988', 'crn_10989', 'crn_10990', 'crn_10991', 'crn_11301', 'crn_11302', 'crn_11303', 'crn_11304', 'crn_11305', 'crn_11306', 'crn_11307', 'crn_11311', 'crn_11312', 'crn_11313', 'crn_11314', 'crn_11315', 'crn_11308', 'crn_11309', 'crn_10992', 'crn_10993', 'crn_20160', 'crn_10994', 'crn_11551', 'crn_10995', 'crn_10996', 'crn_10997', 'crn_10998', 'crn_10999', 'crn_11000', 'crn_11001', 'crn_11002', 'crn_11003', 'crn_11004', 'crn_11254', 'crn_11005', 'crn_11271', 'crn_11006', 'crn_11007', 'crn_11465', 'crn_11008', 'crn_11009', 'crn_11010', 'crn_11011', 'crn_11012', 'crn_11013', 'crn_11014', 'crn_20160', 'crn_11015', 'crn_11016', 'crn_11017', 'crn_11018', 'crn_11019', 'crn_11020', 'crn_11021', 'crn_11022', 'crn_11023', 'crn_11024', 'crn_11025', 'crn_11026', 'crn_11027', 'crn_11028', 'crn_11029', 'crn_11030', 'crn_11031', 'crn_11032', 'crn_11033', 'crn_11034', 'crn_11035', 'crn_11036', 'crn_11037', 'crn_20160', 'crn_11038', 'crn_11039', 'crn_11040', 'crn_11041', 'crn_11042', 'crn_11043', 'crn_11044', 'crn_11045', 'crn_11472', 'crn_11046', 'crn_11532', 'crn_11047', 'crn_11048', 'crn_11049', 'crn_11050', 'crn_11051', 'crn_11052', 'crn_11053', 'crn_11054', 'crn_11055', 'crn_11056', 'crn_11057', 'crn_20160', 'crn_11058', 'crn_11059', 'crn_11060', 'crn_11061', 'crn_11062', 'crn_11063', 'crn_11064', 'crn_11065', 'crn_11066', 'crn_11067', 'crn_11520', 'crn_11068', 'crn_11069', 'crn_11070', 'crn_11071', 'crn_11072', 'crn_11073', 'crn_11074', 'crn_11075', 'crn_11076', 'crn_11077', 'crn_11078', 'crn_11079', 'crn_11080', 'crn_11081', 'crn_11082', 'crn_20160', 'crn_11083', 'crn_11084', 'crn_11085', 'crn_11086', 'crn_11087', 'crn_11088', 'crn_11089', 'crn_11090', 'crn_11091', 'crn_11092', 'crn_11093', 'crn_11094', 'crn_11095', 'crn_11096', 'crn_11097', 'crn_20160', 'crn_11098', 'crn_11099', 'crn_11100', 'crn_11101', 'crn_11102', 'crn_11103', 'crn_11104', 'crn_11105', 'crn_11106', 'crn_11107', 'crn_11108', 'crn_11109', 'crn_11110', 'crn_11111', 'crn_11112', 'crn_11113', 'crn_11114', 'crn_11115', 'crn_11116', 'crn_20160', 'crn_11117', 'crn_11118', 'crn_11119', 'crn_11120', 'crn_11121', 'crn_11122', 'crn_11123', 'crn_11124', 'crn_11125', 'crn_11129', 'crn_11130', 'crn_11131', 'crn_11132', 'crn_11133', 'crn_11134', 'crn_11135', 'crn_11136', 'crn_11137', 'crn_11138', 'crn_11139', 'crn_11140', 'crn_11141', 'crn_11142', 'crn_11143', 'crn_11144', 'crn_11145', 'crn_11146', 'crn_11147', 'crn_11148', 'crn_11149', 'crn_20160', 'crn_11150', 'crn_11151', 'crn_11152', 'crn_11153', 'crn_11154', 'crn_11155', 'crn_11156', 'crn_11157', 'crn_11158', 'crn_11159', 'crn_11160', 'crn_11161', 'crn_11162', 'crn_11163', 'crn_11164', 'crn_11165', 'crn_11166', 'crn_11167', 'crn_11168', 'crn_11169', 'crn_11170', 'crn_11171', 'crn_11172', 'crn_11173', 'crn_11174', 'crn_11175', 'crn_11176', 'crn_11177', 'crn_11178', 'crn_11179', 'crn_20160', 'crn_11180', 'crn_11181', 'crn_11182', 'crn_11183', 'crn_11184', 'crn_11185', 'crn_11186', 'crn_11187', 'crn_11188', 'crn_11189', 'crn_11190', 'crn_11191', 'crn_11192', 'crn_11193', 'crn_11194', 'crn_11195', 'crn_11196', 'crn_11197', 'crn_11198', 'crn_11199', 'crn_11200', 'crn_11201', 'crn_11202', 'crn_11203', 'crn_11204', 'crn_11205', 'crn_11206', 'crn_11207', 'crn_11208', 'crn_11209', 'crn_11210', 'crn_11211', 'crn_11212', 'crn_11213', 'crn_11214'];

var app = {
  timeOut: {},
  init: {},
  pushSockets: {}
};

<<<<<<< HEAD
app.init   =   function(){
    
    // Create a global socket object.
    global.sockets          =   {};
    global.fillData         =   {};
    
    global.lastUpdateCRN    =   Date.now();
    var timeOutTime =   {}
    
    // Grab the last update time.
    memServer.get(CRN_UPDATE_KEY,function(e,data){
        //Set the lastUpdate variable
        global.lastUpdate    = 0;
        console.log('Pushing to sockets in'+((600-(parseInt(Date.now()/1000)-parseInt(data.substr(1))))*1000)+'ms');
        //Set the timeout function to go off after 10min since last update on memcached side.
        setTimeout(app.timeOut,(600-(parseInt(Date.now()/1000)-parseInt(data.substr(1))))*1000);
    });
    
    memServer.getMulti(CRN_ARRAY, function (err, data) {
        //Populate the global fillData object with crns and their corresponding data.
        for(var crn in data){
            global.fillData[crn.substr(CRN_PREFIX.length)]   =   data[crn];
        }
    });    
};

app.timeOut =   function(){
    memServer.get(CRN_UPDATE_KEY,function(e,data){
        //GRAB ALL CRNS and store in fillData
        if(data!==global.lastUpdate){
            memServer.getMulti(CRN_ARRAY, function (err, data) {
                //Populate the global fillData object with crns and their corresponding data.
                console.log('updated memcached');
                for(var crn in data){
                    global.fillData[crn.substr(CRN_PREFIX.length)]   =   data[crn];
                }
                app.pushSockets();
            });
        }
=======
app.init = function() {

  // Create a global socket object.
  global.sockets = {};
  global.fillData = {};

  global.lastUpdateCRN = Date.now();
  var timeOutTime = {};

  // Grab the last update time.
  memServer.get(CRN_UPDATE_KEY, function(e, data) {
    //Set the lastUpdate variable
    global.lastUpdateCRN = 0;
    // console.log('Pushing to sockets in'+((600-(parseInt(Date.now()/1000)-parseInt(data.substr(1))))*1000)+'ms');
    //Set the timeout function to go off after 10min since last update on memcached side.
    setTimeout(app.timeOut, (600 - (parseInt(Date.now() / 1000) - parseInt(data.substr(1)))) * 1000);
  });

  memServer.getMulti(CRN_ARRAY, function(err, data) {
    //Populate the global fillData object with crns and their corresponding data.
    for (var crn in data) {
      global.fillData[crn.substr(CRN_PREFIX.length)] = data[crn];
    }
  });
};

app.timeOut = function() {
  memServer.get(CRN_UPDATE_KEY, function(e, data) {
    //GRAB ALL CRNS and store in fillData

    memServer.getMulti(CRN_ARRAY, function(err, data) {
      //Populate the global fillData object with crns and their corresponding data.
      console.log('updated memcached');
      for (var crn in data) {
        global.fillData[crn.substr(CRN_PREFIX.length)] = data[crn];
      }
      app.pushSockets();
>>>>>>> dev
    });
  });
  //Do this again in 10 minutes
  setTimeout(app.timeOut, 600000);
};

app.pushSockets = function() {
  // Go through all the sockets
  for (var socketId in global.sockets) {
    // Make an array for CRN data
    uniqData = {};
    global.sockets[socketId].uniqArray.forEach(function(uniq, index, array) {
      //push all the necessary crn data to the array
      uniqData[uniq]	=	JSON.parse(global.fillData[uniq]);
    });
    //Push that data to the socket
    global.sockets[socketId].socket.emit('sectionSeatData', uniqData);
  }

};





module.exports = app;
*/
