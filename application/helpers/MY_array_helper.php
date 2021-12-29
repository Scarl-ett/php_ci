<?php
    /**
     * Array 관련 Helper 확장 합니다.
     * 
     * function test() {
     * } 
     * Helper는 클래스를 선언하지 않고 위와 같이 함수만 정의 합니다.
     * Core의 Helper를 재정의 할 수 있습니다.
     * 
     * @author junhan Lee <junes127@gmail.com>
     */

    /**
     *  2차원 배열
     *  ex) 지정한 키 이름을 2차배열에서 찾아서 해당 키값을 1차배열의 키 이름으로 만들어줍니다.
     */
    function array_key($aData, $sIdxName) {

        if (empty($aData)) return;

        $aResult = array();
        foreach($aData as $sKey => $aValue){
            $aResult[$aValue[$sIdxName]] = $aValue;
        }

        return $aResult;

    }
    
    /**
     *  2차원 배열
     *  ex) 지정한 키 이름을 2차배열 에서 찾아서 해당 키값을 1차원 배열로 만들어줍니다.
     */
    function array_value($aData, $sIdxName) {
        
        if (empty($aData)) return;
        
        $aResult = array();
        foreach($aData as $sKey => $aValue){
            $aResult[] = $aValue[$sIdxName];
        }

        return $aResult;

    }
    
    /**
     * 몇 차원 배열인지 알려줍니다.
     */
    function array_deep($arr, $deep=0)
    {
        if (!is_array($arr)) {
            return $deep;
        }
    
        $deep ++;
        foreach ($arr as $key => $value) {
            $deeps[] = array_deep($arr[$key], $deep);
        }
    
        if (empty($deeps)) {
            return null;
        } else {
            return max($deeps);
        }
    }        
    
    function sortByArrayValue ($array, $key) {
        $sorter=array();
        $ret=array();
        reset($array);
        foreach ($array as $ii => $va) {
            $sorter[$ii]=$va[$key];
        }
        asort($sorter);
        foreach ($sorter as $ii => $va) {
            $ret[$ii]=$array[$ii];
        }
        
        return $ret;
    }    
